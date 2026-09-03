import sys
import os

# Add the parent directory of 'app' to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.product import Category, Brand, Collection, Product
import uuid

def run():
    db = SessionLocal()
    try:
        # Categories
        cat_wardrobe = Category(name="Wardrobes", description="Storage and wardrobes")
        cat_decor = Category(name="Decor", description="Home decor items")
        cat_textiles = Category(name="Textiles", description="Rugs, curtains, and linens")
        db.add_all([cat_wardrobe, cat_decor, cat_textiles])
        
        # Brands
        brand_greenply = Brand(name="Greenply", description="Plywood and laminates")
        brand_asian = Brand(name="Asian Paints", description="Wall colors and textures")
        brand_sleepwell = Brand(name="Sleepwell", description="Mattresses and comfort")
        db.add_all([brand_greenply, brand_asian, brand_sleepwell])
        
        # Collections
        col_minimalist = Collection(name="Minimalist", description="Clean and simple designs")
        col_bohemian = Collection(name="Bohemian", description="Free-spirited and eclectic")
        col_industrial = Collection(name="Industrial", description="Raw and unfinished look")
        db.add_all([col_minimalist, col_bohemian, col_industrial])
        
        db.commit()
        
        # Products
        prod1 = Product(
            name="Sliding Glass Wardrobe",
            sku="WARD-GLASS-001",
            description="Modern sliding wardrobe with tinted glass doors.",
            price=45000.0,
            unit="Piece",
            status="ACTIVE",
            is_featured=True,
            category_id=cat_wardrobe.id,
            brand_id=brand_greenply.id,
            collection_id=col_minimalist.id
        )
        
        prod2 = Product(
            name="Handwoven Vintage Rug",
            sku="RUG-VINT-002",
            description="Intricate handwoven rug perfect for a cozy living space.",
            price=12000.0,
            unit="Piece",
            status="ACTIVE",
            is_featured=False,
            category_id=cat_textiles.id,
            collection_id=col_bohemian.id
        )
        
        prod3 = Product(
            name="Copper Pendant Light",
            sku="LIG-PEND-003",
            description="Industrial style copper pendant lighting fixture.",
            price=3500.0,
            unit="Piece",
            status="ACTIVE",
            is_featured=True,
            category_id=cat_decor.id,
            collection_id=col_industrial.id
        )
        
        db.add_all([prod1, prod2, prod3])
        db.commit()
        print("Data seeded successfully!")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run()
