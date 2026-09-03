# This file intentionally left empty.
# Importing models here makes Alembic's autogenerate pick them up automatically.

from app.models.user import User          # noqa: F401
from app.models.lead import Lead, LeadService          # noqa: F401
from app.models.worker import Worker, WorkerSkill, WorkerVerification      # noqa: F401
from app.models.portfolio import PortfolioItem, PortfolioTag  # noqa: F401
from app.models.project import Project, ProjectWorker, ProjectProduct      # noqa: F401
from app.models.quotation import Quotation, QuotationItem      # noqa: F401
from app.models.testimonial import Testimonial      # noqa: F401
from app.models.requirement import Requirement, RequirementProduct  # noqa: F401
from app.models.document import Document        # noqa: F401
from app.models.appointment import Appointment  # noqa: F401
from app.models.task import Task                # noqa: F401
from app.models.activity import Activity        # noqa: F401
from app.models.product import Category, Collection, Brand, Product, ProductImage, ProductSpecification, ProductVariant # noqa: F401
from app.models.newsletter import NewsletterSubscriber # noqa: F401
from app.models.contact import ContactInquiry # noqa: F401
from app.models.consultation import ConsultationRequest # noqa: F401
