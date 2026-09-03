CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> c4d93975d793

CREATE TABLE portfolio_items (
    id CHAR(32) NOT NULL, 
    title VARCHAR(255) NOT NULL, 
    description TEXT, 
    category VARCHAR(100), 
    location VARCHAR(100), 
    image_url VARCHAR(500) NOT NULL, 
    before_image_url VARCHAR(500), 
    after_image_url VARCHAR(500), 
    video_url VARCHAR(500), 
    budget_display VARCHAR(50), 
    display_order INTEGER, 
    is_featured BOOL NOT NULL, 
    is_published BOOL NOT NULL, 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME, 
    PRIMARY KEY (id)
);

CREATE TABLE testimonials (
    id CHAR(32) NOT NULL, 
    client_name VARCHAR(255) NOT NULL, 
    client_designation VARCHAR(255), 
    client_image_url VARCHAR(500), 
    content TEXT NOT NULL, 
    rating INTEGER, 
    is_published BOOL NOT NULL, 
    display_order INTEGER, 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME, 
    PRIMARY KEY (id)
);

CREATE TABLE users (
    id CHAR(32) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    picture VARCHAR(500), 
    google_id VARCHAR(255), 
    `role` ENUM('client','admin','staff') NOT NULL, 
    is_active BOOL NOT NULL, 
    phone VARCHAR(20), 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_users_email ON users (email);

CREATE UNIQUE INDEX ix_users_google_id ON users (google_id);

CREATE TABLE workers (
    id CHAR(32) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    phone VARCHAR(20) NOT NULL, 
    email VARCHAR(255), 
    address TEXT, 
    city VARCHAR(100), 
    worker_type VARCHAR(100), 
    experience_years INTEGER, 
    daily_wage FLOAT, 
    is_available BOOL NOT NULL, 
    is_verified BOOL NOT NULL, 
    aadhar_number VARCHAR(20), 
    pan_number VARCHAR(20), 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME, 
    PRIMARY KEY (id), 
    UNIQUE (email), 
    UNIQUE (phone)
);

CREATE TABLE leads (
    id CHAR(32) NOT NULL, 
    user_id CHAR(32), 
    service_type ENUM('complete_interior','design_only','consultancy') NOT NULL, 
    property_type ENUM('apartment','villa','office','shop','restaurant','hotel'), 
    city VARCHAR(100), 
    address TEXT, 
    pincode VARCHAR(10), 
    carpet_area FLOAT, 
    buildup_area FLOAT, 
    num_rooms INTEGER, 
    budget_min FLOAT, 
    budget_max FLOAT, 
    expected_start_date DATETIME, 
    expected_end_date DATETIME, 
    client_name VARCHAR(255), 
    client_email VARCHAR(255), 
    client_phone VARCHAR(20), 
    meeting_preference ENUM('site_visit','video_call','phone_call','office_visit'), 
    status ENUM('new','contacted','site_visit_scheduled','quoted','negotiating','won','lost') NOT NULL, 
    assigned_to CHAR(32), 
    notes TEXT, 
    source VARCHAR(100), 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME, 
    PRIMARY KEY (id), 
    FOREIGN KEY(assigned_to) REFERENCES users (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE TABLE portfolio_tags (
    id CHAR(32) NOT NULL, 
    portfolio_item_id CHAR(32) NOT NULL, 
    tag_name VARCHAR(50) NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(portfolio_item_id) REFERENCES portfolio_items (id) ON DELETE CASCADE
);

CREATE TABLE worker_skills (
    id CHAR(32) NOT NULL, 
    worker_id CHAR(32) NOT NULL, 
    skill_name VARCHAR(100) NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(worker_id) REFERENCES workers (id) ON DELETE CASCADE
);

CREATE TABLE worker_verifications (
    id CHAR(32) NOT NULL, 
    worker_id CHAR(32) NOT NULL, 
    document_type VARCHAR(50) NOT NULL, 
    document_number VARCHAR(100) NOT NULL, 
    is_verified BOOL, 
    verified_at DATETIME, 
    PRIMARY KEY (id), 
    FOREIGN KEY(worker_id) REFERENCES workers (id) ON DELETE CASCADE
);

CREATE TABLE lead_services (
    id CHAR(32) NOT NULL, 
    lead_id CHAR(32) NOT NULL, 
    service_name VARCHAR(100) NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(lead_id) REFERENCES leads (id) ON DELETE CASCADE
);

CREATE TABLE projects (
    id CHAR(32) NOT NULL, 
    lead_id CHAR(32), 
    name VARCHAR(255) NOT NULL, 
    description TEXT, 
    status ENUM('planning','in_progress','on_hold','completed','cancelled') NOT NULL, 
    start_date DATETIME, 
    end_date DATETIME, 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME, 
    PRIMARY KEY (id), 
    FOREIGN KEY(lead_id) REFERENCES leads (id) ON DELETE SET NULL, 
    UNIQUE (lead_id)
);

CREATE TABLE quotations (
    id CHAR(32) NOT NULL, 
    lead_id CHAR(32) NOT NULL, 
    total_amount FLOAT NOT NULL, 
    valid_until DATETIME NOT NULL, 
    document_url VARCHAR(500), 
    status ENUM('draft','sent','accepted','rejected') NOT NULL, 
    notes TEXT, 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME, 
    PRIMARY KEY (id), 
    FOREIGN KEY(lead_id) REFERENCES leads (id) ON DELETE CASCADE
);

CREATE TABLE project_workers (
    id CHAR(32) NOT NULL, 
    project_id CHAR(32) NOT NULL, 
    worker_id CHAR(32) NOT NULL, 
    assigned_role VARCHAR(100), 
    assigned_at DATETIME, 
    PRIMARY KEY (id), 
    FOREIGN KEY(project_id) REFERENCES projects (id) ON DELETE CASCADE, 
    FOREIGN KEY(worker_id) REFERENCES workers (id) ON DELETE CASCADE
);

INSERT INTO alembic_version (version_num) VALUES ('c4d93975d793');

-- Running upgrade c4d93975d793 -> 2bb62df2bb3f

CREATE TABLE activities (
    id CHAR(32) NOT NULL, 
    user_id CHAR(32), 
    action VARCHAR(255) NOT NULL, 
    entity_type VARCHAR(50), 
    entity_id CHAR(32), 
    old_value VARCHAR(255), 
    new_value VARCHAR(255), 
    created_at DATETIME NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE requirements (
    id CHAR(32) NOT NULL, 
    lead_id CHAR(32), 
    customer_id CHAR(32), 
    service_type VARCHAR(50), 
    property_type VARCHAR(50), 
    city VARCHAR(100), 
    address TEXT, 
    pincode VARCHAR(20), 
    carpet_area FLOAT, 
    buildup_area FLOAT, 
    num_rooms INTEGER, 
    budget_min FLOAT, 
    budget_max FLOAT, 
    expected_start_date DATETIME, 
    expected_end_date DATETIME, 
    status VARCHAR(50), 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME, 
    PRIMARY KEY (id), 
    FOREIGN KEY(customer_id) REFERENCES users (id) ON DELETE CASCADE, 
    FOREIGN KEY(lead_id) REFERENCES leads (id) ON DELETE SET NULL
);

CREATE TABLE appointments (
    id CHAR(32) NOT NULL, 
    customer_id CHAR(32) NOT NULL, 
    project_id CHAR(32), 
    staff_id CHAR(32), 
    appointment_type VARCHAR(50), 
    date_time DATETIME NOT NULL, 
    location TEXT, 
    notes TEXT, 
    status VARCHAR(50), 
    created_at DATETIME NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(customer_id) REFERENCES users (id) ON DELETE CASCADE, 
    FOREIGN KEY(project_id) REFERENCES projects (id) ON DELETE CASCADE, 
    FOREIGN KEY(staff_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE documents (
    id CHAR(32) NOT NULL, 
    original_name VARCHAR(255) NOT NULL, 
    s3_key VARCHAR(500) NOT NULL, 
    file_type VARCHAR(50), 
    file_size INTEGER, 
    uploaded_by_id CHAR(32), 
    customer_id CHAR(32), 
    requirement_id CHAR(32), 
    project_id CHAR(32), 
    created_at DATETIME NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(customer_id) REFERENCES users (id) ON DELETE CASCADE, 
    FOREIGN KEY(project_id) REFERENCES projects (id) ON DELETE CASCADE, 
    FOREIGN KEY(requirement_id) REFERENCES requirements (id) ON DELETE CASCADE, 
    FOREIGN KEY(uploaded_by_id) REFERENCES users (id)
);

CREATE TABLE tasks (
    id CHAR(32) NOT NULL, 
    title VARCHAR(255) NOT NULL, 
    description TEXT, 
    assigned_to_id CHAR(32), 
    customer_id CHAR(32), 
    project_id CHAR(32), 
    priority VARCHAR(50), 
    due_date DATETIME, 
    status VARCHAR(50), 
    created_at DATETIME NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(assigned_to_id) REFERENCES users (id) ON DELETE SET NULL, 
    FOREIGN KEY(customer_id) REFERENCES users (id) ON DELETE CASCADE, 
    FOREIGN KEY(project_id) REFERENCES projects (id) ON DELETE CASCADE
);

ALTER TABLE users ADD COLUMN dob DATETIME;

ALTER TABLE users ADD COLUMN gender VARCHAR(20);

ALTER TABLE users ADD COLUMN address TEXT;

ALTER TABLE users ADD COLUMN city VARCHAR(100);

ALTER TABLE users ADD COLUMN state VARCHAR(100);

ALTER TABLE users ADD COLUMN country VARCHAR(100);

ALTER TABLE users ADD COLUMN pincode VARCHAR(20);

ALTER TABLE users ADD COLUMN customer_status VARCHAR(50);

ALTER TABLE users ADD COLUMN notes TEXT;

UPDATE alembic_version SET version_num='2bb62df2bb3f' WHERE alembic_version.version_num = 'c4d93975d793';

-- Running upgrade 2bb62df2bb3f -> a9447ab11fe9

ALTER TABLE documents ADD COLUMN file_path VARCHAR(500) NOT NULL;

ALTER TABLE documents DROP COLUMN s3_key;

UPDATE alembic_version SET version_num='a9447ab11fe9' WHERE alembic_version.version_num = '2bb62df2bb3f';

-- Running upgrade a9447ab11fe9 -> b08c9eed2874

CREATE TABLE brands (
    id CHAR(32) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    description TEXT, 
    created_at DATETIME, 
    updated_at DATETIME, 
    PRIMARY KEY (id)
);

CREATE TABLE categories (
    id CHAR(32) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    description TEXT, 
    image_url VARCHAR(500), 
    parent_id CHAR(32), 
    is_active BOOL, 
    created_at DATETIME, 
    updated_at DATETIME, 
    PRIMARY KEY (id), 
    FOREIGN KEY(parent_id) REFERENCES categories (id) ON DELETE SET NULL
);

CREATE TABLE collections (
    id CHAR(32) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    description TEXT, 
    created_at DATETIME, 
    updated_at DATETIME, 
    PRIMARY KEY (id)
);

CREATE TABLE products (
    id CHAR(32) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    sku VARCHAR(100) NOT NULL, 
    category_id CHAR(32), 
    collection_id CHAR(32), 
    brand_id CHAR(32), 
    description TEXT, 
    short_description VARCHAR(500), 
    price FLOAT NOT NULL, 
    sale_price FLOAT, 
    unit VARCHAR(50), 
    availability BOOL, 
    status ENUM('DRAFT','ACTIVE','INACTIVE','OUT_OF_STOCK','ARCHIVED') NOT NULL, 
    created_at DATETIME, 
    updated_at DATETIME, 
    PRIMARY KEY (id), 
    FOREIGN KEY(brand_id) REFERENCES brands (id) ON DELETE SET NULL, 
    FOREIGN KEY(category_id) REFERENCES categories (id) ON DELETE SET NULL, 
    FOREIGN KEY(collection_id) REFERENCES collections (id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX ix_products_sku ON products (sku);

CREATE INDEX ix_products_status ON products (status);

CREATE TABLE product_images (
    id CHAR(32) NOT NULL, 
    product_id CHAR(32) NOT NULL, 
    file_path VARCHAR(500) NOT NULL, 
    is_main BOOL, 
    display_order INTEGER, 
    created_at DATETIME, 
    PRIMARY KEY (id), 
    FOREIGN KEY(product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE product_specifications (
    id CHAR(32) NOT NULL, 
    product_id CHAR(32) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    value VARCHAR(255) NOT NULL, 
    unit VARCHAR(50), 
    PRIMARY KEY (id), 
    FOREIGN KEY(product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE product_variants (
    id CHAR(32) NOT NULL, 
    product_id CHAR(32) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    sku VARCHAR(100), 
    price FLOAT, 
    color VARCHAR(100), 
    size VARCHAR(100), 
    material VARCHAR(100), 
    availability BOOL, 
    image_url VARCHAR(500), 
    created_at DATETIME, 
    updated_at DATETIME, 
    PRIMARY KEY (id), 
    FOREIGN KEY(product_id) REFERENCES products (id) ON DELETE CASCADE, 
    UNIQUE (sku)
);

CREATE TABLE project_products (
    id CHAR(32) NOT NULL, 
    project_id CHAR(32) NOT NULL, 
    product_id CHAR(32) NOT NULL, 
    quantity INTEGER, 
    status VARCHAR(50), 
    notes TEXT, 
    created_at DATETIME, 
    PRIMARY KEY (id), 
    FOREIGN KEY(product_id) REFERENCES products (id) ON DELETE CASCADE, 
    FOREIGN KEY(project_id) REFERENCES projects (id) ON DELETE CASCADE
);

CREATE TABLE quotation_items (
    id CHAR(32) NOT NULL, 
    quotation_id CHAR(32) NOT NULL, 
    product_id CHAR(32), 
    product_name VARCHAR(255) NOT NULL, 
    unit_price FLOAT NOT NULL, 
    quantity INTEGER NOT NULL, 
    discount FLOAT, 
    notes TEXT, 
    created_at DATETIME, 
    PRIMARY KEY (id), 
    FOREIGN KEY(product_id) REFERENCES products (id) ON DELETE SET NULL, 
    FOREIGN KEY(quotation_id) REFERENCES quotations (id) ON DELETE CASCADE
);

CREATE TABLE requirement_products (
    id CHAR(32) NOT NULL, 
    requirement_id CHAR(32) NOT NULL, 
    product_id CHAR(32) NOT NULL, 
    quantity INTEGER, 
    notes TEXT, 
    created_at DATETIME, 
    PRIMARY KEY (id), 
    FOREIGN KEY(product_id) REFERENCES products (id) ON DELETE CASCADE, 
    FOREIGN KEY(requirement_id) REFERENCES requirements (id) ON DELETE CASCADE
);

UPDATE alembic_version SET version_num='b08c9eed2874' WHERE alembic_version.version_num = 'a9447ab11fe9';

-- Running upgrade b08c9eed2874 -> db20e00f5c2e

CREATE TABLE consultation_requests (
    id CHAR(32) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    phone VARCHAR(50) NOT NULL, 
    city VARCHAR(100) NOT NULL, 
    preferred_date DATE, 
    requirement_type VARCHAR(100), 
    status VARCHAR(50) NOT NULL, 
    notes TEXT, 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME, 
    PRIMARY KEY (id)
);

CREATE TABLE contact_inquiries (
    id CHAR(32) NOT NULL, 
    first_name VARCHAR(255) NOT NULL, 
    last_name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    phone VARCHAR(50), 
    message TEXT NOT NULL, 
    status VARCHAR(50) NOT NULL, 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME, 
    PRIMARY KEY (id)
);

CREATE TABLE newsletter_subscribers (
    id CHAR(32) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    status VARCHAR(50) NOT NULL, 
    source VARCHAR(100) NOT NULL, 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_newsletter_subscribers_email ON newsletter_subscribers (email);

ALTER TABLE requirements ADD COLUMN customer_name VARCHAR(255);

ALTER TABLE requirements ADD COLUMN customer_email VARCHAR(255);

ALTER TABLE requirements ADD COLUMN customer_phone VARCHAR(50);

ALTER TABLE requirements ADD COLUMN customer_whatsapp VARCHAR(50);

ALTER TABLE requirements ADD COLUMN property_status VARCHAR(100);

ALTER TABLE requirements ADD COLUMN location_city VARCHAR(100);

ALTER TABLE requirements ADD COLUMN location_state VARCHAR(100);

ALTER TABLE requirements ADD COLUMN location_locality VARCHAR(255);

ALTER TABLE requirements ADD COLUMN scope VARCHAR(255);

ALTER TABLE requirements ADD COLUMN property_size VARCHAR(100);

ALTER TABLE requirements ADD COLUMN budget_range VARCHAR(100);

ALTER TABLE requirements ADD COLUMN timeline VARCHAR(100);

ALTER TABLE requirements ADD COLUMN design_preferences TEXT;

ALTER TABLE requirements ADD COLUMN additional_notes TEXT;

ALTER TABLE requirements MODIFY property_type VARCHAR(100) NULL;

ALTER TABLE requirements MODIFY status VARCHAR(50) NOT NULL;

ALTER TABLE requirements DROP COLUMN expected_start_date;

ALTER TABLE requirements DROP COLUMN expected_end_date;

ALTER TABLE requirements DROP COLUMN service_type;

ALTER TABLE requirements DROP COLUMN budget_max;

ALTER TABLE requirements DROP COLUMN budget_min;

ALTER TABLE requirements DROP COLUMN buildup_area;

ALTER TABLE requirements DROP COLUMN num_rooms;

ALTER TABLE requirements DROP COLUMN carpet_area;

ALTER TABLE requirements DROP COLUMN city;

UPDATE alembic_version SET version_num='db20e00f5c2e' WHERE alembic_version.version_num = 'b08c9eed2874';

-- Running upgrade db20e00f5c2e -> fca192e02ac5

ALTER TABLE products ADD COLUMN is_featured BOOL;

UPDATE alembic_version SET version_num='fca192e02ac5' WHERE alembic_version.version_num = 'db20e00f5c2e';

