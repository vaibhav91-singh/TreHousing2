from django.core.management.base import BaseCommand
from core.models import (
    JobVacancy, RecentUpdate, Course, Subject, 
    StudyMaterialExam, StudyMaterialSubject, StudyMaterialDocument, 
    TopicExam, TopicSubject, TopicName, TopicQuestion, 
    Quiz, Question, Choice, SolvedPaper
)
import datetime

class Command(BaseCommand):
    help = "Seed database with initial sample data for testing Admin Panel and Frontend"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding sample data...")

        # 1. Job Vacancies
        JobVacancy.objects.get_or_create(
            title='BPSC TRE 4.0 Teacher Recruitment 2026',
            defaults={
                'organization': 'BPSC Bihar',
                'eligibility': 'Graduate + B.Ed + STET',
                'form_fee': 750,
                'apply_date': datetime.date(2026, 8, 1),
                'last_date': datetime.date(2026, 9, 15),
                'official_website': 'https://bpsc.bih.nic.in',
                'apply_link': 'https://bpsc.bih.nic.in',
                'category_badge': 'BPSC',
                'vacancy_count': '87,000+ Vacancies',
                'qualification': 'Graduation + B.Ed',
                'status': True
            }
        )
        JobVacancy.objects.get_or_create(
            title='SSC CGL 2026 Notification',
            defaults={
                'organization': 'Staff Selection Commission',
                'eligibility': 'Bachelor Degree in any stream',
                'form_fee': 100,
                'apply_date': datetime.date(2026, 7, 10),
                'last_date': datetime.date(2026, 8, 25),
                'official_website': 'https://ssc.gov.in',
                'apply_link': 'https://ssc.gov.in',
                'category_badge': 'SSC',
                'vacancy_count': '17,727 Vacancies',
                'qualification': 'Graduation',
                'status': True
            }
        )

        # 2. Recent Updates
        RecentUpdate.objects.get_or_create(
            title='UPSC CSE 2026 Prelims Admit Card Released',
            defaults={
                'description': 'Download your admit card from the official UPSC portal now.',
                'link': 'https://upsc.gov.in'
            }
        )
        RecentUpdate.objects.get_or_create(
            title='BPSC 70th Prelims Revised Exam Schedule',
            defaults={
                'description': 'BPSC Has released official exam calendar updates for prelims and mains.',
                'link': 'https://bpsc.bih.nic.in'
            }
        )

        # 3. Courses & Subjects
        c1, _ = Course.objects.get_or_create(title='UPSC General Studies Foundation 2026', defaults={'description': 'Comprehensive Coverage of Prelims and Mains Syllabus'})
        s1, _ = Subject.objects.get_or_create(course=c1, title='Indian Polity & Constitution', defaults={'description': 'Full Polity Syllabus Notes & PYQs', 'total_questions': 100, 'total_marks': 100})

        c2, _ = Course.objects.get_or_create(title='BPSC Special Bihar Special GK', defaults={'description': 'Bihar History, Geography & Economy'})
        s2, _ = Subject.objects.get_or_create(course=c2, title='Bihar Modern History', defaults={'description': 'Detailed Bihar Freedom Movement Notes', 'total_questions': 50, 'total_marks': 50})

        # 4. Study Materials
        se, _ = StudyMaterialExam.objects.get_or_create(name='UPSC CSE')
        ss, _ = StudyMaterialSubject.objects.get_or_create(exam=se, name='Indian Polity')
        StudyMaterialDocument.objects.get_or_create(subject=ss, title='Constitution Laxmikanth Notes Part 1', defaults={'file_link': 'https://drive.google.com/file/d/12345sample/view'})

        se2, _ = StudyMaterialExam.objects.get_or_create(name='BPSC Exam')
        ss2, _ = StudyMaterialSubject.objects.get_or_create(exam=se2, name='Bihar GK')
        StudyMaterialDocument.objects.get_or_create(subject=ss2, title='Imtiaz Ahmad Bihar Special Handnotes', defaults={'file_link': 'https://drive.google.com/file/d/67890sample/view'})

        # 5. Topic MCQs
        te, _ = TopicExam.objects.get_or_create(name='UPSC / BPSC General Studies')
        ts, _ = TopicSubject.objects.get_or_create(exam=te, name='Indian History')
        tn, _ = TopicName.objects.get_or_create(subject=ts, name='Indus Valley Civilization', defaults={'bulk_upload_json': ''})
        TopicQuestion.objects.get_or_create(
            topic=tn, 
            text='Which site of Indus Valley Civilization was famous for its Dockyard?', 
            defaults={'option_a': 'Lothal', 'option_b': 'Harappa', 'option_c': 'Mohenjo-daro', 'option_d': 'Kalibangan', 'correct_option': 'A'}
        )

        # 6. Quiz / Mock Test
        q, _ = Quiz.objects.get_or_create(title='BPSC TRE 3.0 GK General Knowledge Mock Test', defaults={'category': 'BPSC', 'description': 'Full length practice test for BPSC Teacher examination.'})
        qu, _ = Question.objects.get_or_create(quiz=q, text='What is the capital of Bihar?')
        Choice.objects.get_or_create(question=qu, text='Patna', defaults={'is_correct': True})
        Choice.objects.get_or_create(question=qu, text='Gaya', defaults={'is_correct': False})
        Choice.objects.get_or_create(question=qu, text='Muzaffarpur', defaults={'is_correct': False})
        Choice.objects.get_or_create(question=qu, text='Darbhanga', defaults={'is_correct': False})

        # 7. Solved Papers
        SolvedPaper.objects.get_or_create(
            title='UPSC CSE Prelims 2024 GS Paper 1 Solved Paper',
            defaults={
                'subject': s1,
                'year': 2024,
                'paper_link': 'https://drive.google.com/file/d/sample-paper/view',
                'answer_key_link': 'https://drive.google.com/file/d/sample-key/view'
            }
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded all dummy data!"))
