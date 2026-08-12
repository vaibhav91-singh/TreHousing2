from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Course, Subject, Syllabus, PYQ, Sub_Courses
from django.http import FileResponse, JsonResponse, Http404
from django.conf import settings
# For Quiz
from .models import Quiz, Question, Choice
from .serializers import (
    CourseSerializer, SubjectSerializer, QuizSerializer, SolvedPaperSerializer,
    JobVacancySerializer, RecentUpdateSerializer, TopicExamSerializer,
    StudyMaterialExamSerializer, StudyMaterialDocumentSerializer
)
import os


@api_view(['GET', 'POST'])
def courses_list_create(request):
    if request.method == 'GET':
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        title = request.data.get('title')
        description = request.data.get('description', '')
        course = Course.objects.create(title=title, description=description)
        return Response({"success": True, "data": CourseSerializer(course).data}, status=201)

@api_view(['GET', 'POST'])
def subjects_list_create(request):
    if request.method == 'GET':
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        course_id = request.data.get('course')
        title = request.data.get('title')
        description = request.data.get('description', '')
        total_questions = request.data.get('total_questions', 100)
        total_marks = request.data.get('total_marks', 100)
        
        course = Course.objects.get(id=course_id) if course_id else Course.objects.first()
        if not course:
            course = Course.objects.create(title="General Course", description="Auto created")
            
        subject = Subject.objects.create(
            course=course,
            title=title,
            description=description,
            pdf_link="",
            total_questions=total_questions,
            total_marks=total_marks
        )
        return Response({"success": True, "data": SubjectSerializer(subject).data}, status=201)

@api_view(['GET'])
def course_api(request):
    course_id = request.GET.get('course_id')
    subject_id = request.GET.get('subject_id')
    pdf_request = request.GET.get('pdf') == "true"
    syllabus_list = request.GET.get('syllabus_list') == "true"
    syllabus_name = request.GET.get('syllabus')

    if not course_id and not subject_id:
        courses = Course.objects.prefetch_related('subjects').all()
        response_data = [
            {
                "id": course.id,
                "title": course.title,
                "subjects": [
                    {"id": subject.id, "title": subject.title}
                    for subject in course.subjects.all()
                ]
            }
            for course in courses
        ]
        return Response(response_data)


    try:
        course = Course.objects.prefetch_related('subjects').get(id=course_id)
        subject = Subject.objects.prefetch_related('exam_patterns', 'subject_contents').get(id=subject_id, course=course)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)
    except Subject.DoesNotExist:
        return Response({"error": "Subject not found"}, status=404)

    
    if pdf_request:
        if not subject.pdf_link:
            return Response({"error": "No PDF available for this subject"}, status=404)

        pdf_path = os.path.join(settings.MEDIA_ROOT, subject.pdf_link.name)
        if os.path.exists(pdf_path):
            return FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')
        else:
            return Response({"error": "File not found"}, status=404)

    if syllabus_list:
        syllabi = Syllabus.objects.filter(subject=subject)
        data = [os.path.basename(syllabus.file.name) for syllabus in syllabi]
        return Response({"syllabus_list": data})

    if syllabus_name:
        syllabus_qs = Syllabus.objects.filter(subject=subject)
        for syllabus in syllabus_qs:
            if os.path.basename(syllabus.file.name) == syllabus_name:
                file_path = syllabus.file.path
                if os.path.exists(file_path):
                    return FileResponse(open(file_path, 'rb'), content_type='application/pdf')
                else:
                    return Response({"error": "File not found"}, status=404)
        return Response({"error": "Syllabus file not found for this subject"}, status=404)


    response_data = {
        "course": {
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "banner": course.banner.url if course.banner else None,
            "subjects": [
                {
                    "id": subject.id,
                    "title": subject.title,
                    "description": subject.description,
                    "pdf_link": subject.pdf_link.url if subject.pdf_link else None,
                    "total_questions": subject.total_questions,
                    "total_marks": subject.total_marks,
                    "exam_patterns": [
                        {
                            "topics": ep.topics,
                            "sub_topics": ep.sub_topics,
                            "no_of_questions": ep.no_of_questions,
                            "maximum_marks": ep.maximum_marks,
                            "duration": ep.duration
                        }
                        for ep in subject.exam_patterns.all()
                    ],
                    "subject_contents": [
                        {
                            "title": sc.title,
                            "description": sc.description,
                            "reference_links": sc.reference_links
                        }
                        for sc in subject.subject_contents.all()
                    ]
                }
            ]
        }
    }
    
    return Response(response_data)


@api_view(['GET'])
def pyq_api(request):
    course_id = request.GET.get('course_id')
    sub_courses_id = request.GET.get('sub_courses')
    subject_id = request.GET.get('subject_id')
    file_name = request.GET.get('file')

    # ✅ Case 1: Return Sub-Courses with IDs and Titles
    if course_id and not sub_courses_id and not subject_id:
        try:
            course = Course.objects.get(id=course_id)
            sub_courses = course.sub_courses.all()
            subjects = course.subjects.all()

            subject_data = [{"id": subject.id, "title": subject.title} for subject in subjects]

            sub_course_data = []
            for sc in sub_courses:
                sub_course_data.append({
                    "id": sc.id,
                    "title": sc.title,
                    "subjects": subject_data  # all course subjects (shared)
                })
            return JsonResponse({course.title: sub_course_data})
        except Course.DoesNotExist:
            return JsonResponse({"error": "Course not found"}, status=404)

    # ✅ Case 2: Return PYQs grouped under subjects and sub-course
    if course_id and sub_courses_id and not file_name and not subject_id:
        try:
            course = Course.objects.get(id=course_id)
            sub_course = course.sub_courses.get(id=sub_courses_id)
        except (Course.DoesNotExist, Sub_Courses.DoesNotExist):
            return JsonResponse({"error": "Invalid course or sub-course ID"}, status=404)

        result = {course.title: {sub_course.title: []}}

        subjects = course.subjects.all()
        for subject in subjects:
            pyqs = subject.pyqs.all()
            pyq_files = [os.path.basename(pyq.file.name) for pyq in pyqs if pyq.file]

            if pyq_files:
                result[course.title][sub_course.title].append({
                    "id": subject.id,
                    subject.title: pyq_files
                })

        return JsonResponse(result)

    # ✅ Case 3: Serve a specific file
    if course_id and sub_courses_id and subject_id and file_name:
        try:
            course = Course.objects.get(id=course_id)
            sub_course = course.sub_courses.get(id=sub_courses_id)
            subject = course.subjects.get(id=subject_id)
            pyq = subject.pyqs.get(file__icontains=file_name)
            file_path = pyq.file.path

            if os.path.exists(file_path):
                return FileResponse(open(file_path, 'rb'), content_type='application/pdf')
            else:
                raise Http404("File not found")

        except (Course.DoesNotExist, Sub_Courses.DoesNotExist, Subject.DoesNotExist, PYQ.DoesNotExist):
            return JsonResponse({"error": "Invalid course, sub-course, subject, or file name"}, status=404)

    return JsonResponse({"error": "Invalid query parameters"}, status=400)

    # ==========================================================================
# QUIZ AND MOCK TEST API ENDPOINT (GET & POST)
# ==========================================================================
import random
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET', 'POST'])
def quiz_api(request):
    if request.method == 'GET':
        quiz_id = request.GET.get('quiz_id')
        subject_id = request.GET.get('subject_id')
        
        def shuffle_quiz_data(data):
            if isinstance(data, list):
                for quiz in data:
                    random.shuffle(quiz['questions'])
                    for q in quiz['questions']:
                        random.shuffle(q['choices'])
                    if quiz.get('display_questions_limit'):
                        quiz['questions'] = quiz['questions'][:quiz['display_questions_limit']]
            else:
                random.shuffle(data['questions'])
                for q in data['questions']:
                    random.shuffle(q['choices'])
                if data.get('display_questions_limit'):
                    data['questions'] = data['questions'][:data['display_questions_limit']]
            return data

        if quiz_id:
            try:
                quiz = Quiz.objects.prefetch_related('questions__choices').get(id=quiz_id)
                serializer = QuizSerializer(quiz)
                shuffled_data = shuffle_quiz_data(serializer.data)
                return Response(shuffled_data)
            except Quiz.DoesNotExist:
                return Response({"error": "Quiz not found"}, status=404)

        if subject_id:
            quizzes = Quiz.objects.filter(subject_id=subject_id).prefetch_related('questions__choices')
        else:
            quizzes = Quiz.objects.prefetch_related('questions__choices').all()
        
        serializer = QuizSerializer(quizzes, many=True)
        shuffled_data = shuffle_quiz_data(serializer.data)
        return Response(shuffled_data)

    elif request.method == 'POST':
        serializer = QuizSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ==========================================================================
# Solved Papers API ENDPOINT (GET & POST)
# ==========================================================================
@api_view(['GET', 'POST'])
def get_solved_papers(request):
    if request.method == 'GET':
        try:
            papers = SolvedPaper.objects.all().order_by('-created_at')
            subject_id = request.GET.get('subject_id')
            if subject_id:
                papers = papers.filter(subject_id=subject_id)
                
            serializer = SolvedPaperSerializer(papers, many=True)
            return Response({"success": True, "data": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'POST':
        try:
            title = request.data.get('title')
            year = request.data.get('year', 2024)
            paper_link = request.data.get('paper_link')
            answer_key_link = request.data.get('answer_key_link', '')
            
            # Auto-assign or get default subject
            subject = Subject.objects.first()
            if not subject:
                course = Course.objects.create(title="General Course", description="Auto created for papers")
                subject = Subject.objects.create(course=course, title="General Paper Subject", description="General", pdf_link="", total_questions=100, total_marks=100)
                
            paper = SolvedPaper.objects.create(
                subject=subject,
                title=title,
                year=year,
                paper_link=paper_link,
                answer_key_link=answer_key_link
            )
            return Response({"success": True, "data": SolvedPaperSerializer(paper).data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ==========================================================================
#   JOB VACANCY
#=====================================================================
@api_view(['GET', 'POST'])
def job_list_create(request):
    if request.method == 'GET':
        jobs = JobVacancy.objects.filter(status=True) 
        serializer = JobVacancySerializer(jobs, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = JobVacancySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
def job_detail_api(request, pk):
    job = get_object_or_404(JobVacancy, pk=pk)
    if request.method == 'GET':
        serializer = JobVacancySerializer(job)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = JobVacancySerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        job.delete()
        return Response({"success": True}, status=204)

@api_view(['GET'])
def get_user_performance(request):
    performance = UserPerformance.objects.all()
    serializer = UserPerformanceSerializer(performance, many=True)
    return Response(serializer.data)

# ==========================================================================
# RECENT UPDATES
#=====================================================================
@api_view(['GET', 'POST'])
def recent_updates_list(request):
    if request.method == 'GET':
        updates = RecentUpdate.objects.all()[:10]
        serializer = RecentUpdateSerializer(updates, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = RecentUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ==========================================================================
# TOPIC-WISE MCQ SYSTEM ENDPOINT (GET & POST)
# ==========================================================================
@api_view(['GET', 'POST'])
def topic_wise_mcq_api(request):
    if request.method == 'GET':
        try:
            exams = TopicExam.objects.all().prefetch_related('subjects__topics__questions')
            serializer = TopicExamSerializer(exams, many=True)
            return Response({
                "success": True,
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "success": False,
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'POST':
        subject_name = request.data.get('subject_name', 'General')
        topic_name_val = request.data.get('topic_name')
        bulk_json = request.data.get('bulk_json', '')

        try:
            exam = TopicExam.objects.first()
            if not exam:
                exam = TopicExam.objects.create(name="General Exam")
            
            subject, _ = TopicSubject.objects.get_or_create(exam=exam, name=subject_name)
            topic = TopicName.objects.create(subject=subject, name=topic_name_val, bulk_upload_json=bulk_json)
            return Response({"success": True, "message": "Topic and Questions Created Successfully"}, status=201)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=400)

# ==========================================================================
# STUDY MATERIAL SYSTEM ENDPOINT (GET & POST)
# ==========================================================================
@api_view(['GET', 'POST'])
def study_materials_api(request):
    if request.method == 'GET':
        try:
            exams = StudyMaterialExam.objects.all().prefetch_related('materials_subjects__documents')
            serializer = StudyMaterialExamSerializer(exams, many=True)
            return Response({
                "success": True,
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "success": False,
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'POST':
        exam_name = request.data.get('exam_name', 'General Exam')
        subject_name = request.data.get('subject_name', 'General Subject')
        title = request.data.get('title')
        file_link = request.data.get('file_link')

        try:
            exam, _ = StudyMaterialExam.objects.get_or_create(name=exam_name)
            subject, _ = StudyMaterialSubject.objects.get_or_create(exam=exam, name=subject_name)
            doc = StudyMaterialDocument.objects.create(subject=subject, title=title, file_link=file_link)
            return Response({"success": True, "data": StudyMaterialDocumentSerializer(doc).data}, status=201)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=400)


