CREATE DATABASE IF NOT EXISTS workforce_db;
USE workforce_db;

-- =========================
-- TABLES
-- =========================

CREATE TABLE countries (
  country_id INT AUTO_INCREMENT PRIMARY KEY,
  country_name VARCHAR(100) NOT NULL,
  country_code CHAR(2) NOT NULL UNIQUE
);

CREATE TABLE cities (
  city_id INT AUTO_INCREMENT PRIMARY KEY,
  city_name VARCHAR(100) NOT NULL,
  country_id INT,
  FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

CREATE TABLE roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE
);

CREATE TABLE status (
  status_id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(50)
);

CREATE TABLE employees (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  full_name VARCHAR(200) GENERATED ALWAYS AS (CONCAT(first_name,' ',last_name)) STORED,
  role_id INT,
  city_id INT,
  country_id INT,
  company_email VARCHAR(150) UNIQUE,
  personal_email VARCHAR(150),
  phone_number VARCHAR(30),
  reports_to INT,
  status_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (role_id) REFERENCES roles(role_id),
  FOREIGN KEY (city_id) REFERENCES cities(city_id),
  FOREIGN KEY (country_id) REFERENCES countries(country_id),
  FOREIGN KEY (reports_to) REFERENCES employees(employee_id),
  FOREIGN KEY (status_id) REFERENCES status(status_id)
);

CREATE TABLE contracts (
  contract_id INT AUTO_INCREMENT PRIMARY KEY,
  contract_type VARCHAR(50)
);

CREATE TABLE waves (
  wave_id INT AUTO_INCREMENT PRIMARY KEY,
  wave_name VARCHAR(100),
  start_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wave_stages (
  wave_stage_id INT AUTO_INCREMENT PRIMARY KEY,
  wave_id INT,
  stage_name ENUM('TRAINING','NESTING','PRODUCTION'),
  start_date DATE,
  end_date DATE,
  FOREIGN KEY (wave_id) REFERENCES waves(wave_id)
);

CREATE TABLE interpreter_details (
  interpreter_id INT PRIMARY KEY,
  wave_id INT NOT NULL,
  contract_id INT,
  start_date DATE,
  nesting_date DATE,
  production_start_date DATE,

  INDEX idx_interpreter_details_wave_id (wave_id),
  FOREIGN KEY (interpreter_id) REFERENCES employees(employee_id),
  FOREIGN KEY (wave_id) REFERENCES waves(wave_id),
  FOREIGN KEY (contract_id) REFERENCES contracts(contract_id)
);

CREATE TABLE languages (
  language_id INT AUTO_INCREMENT PRIMARY KEY,
  language_name VARCHAR(50) UNIQUE
);

CREATE TABLE interpreter_languages (
  interpreter_id INT,
  language_id INT,
  PRIMARY KEY (interpreter_id, language_id),
  FOREIGN KEY (interpreter_id) REFERENCES employees(employee_id),
  FOREIGN KEY (language_id) REFERENCES languages(language_id)
);

CREATE TABLE schedules (
  schedule_id INT AUTO_INCREMENT PRIMARY KEY,
  start_time TIME,
  end_time TIME,
  hours_per_day DECIMAL(4,2),
  hours_per_week DECIMAL(5,2),
  schedule_type VARCHAR(50),
  ce_schedule VARCHAR(100)
);

CREATE TABLE schedule_days (
  schedule_id INT,
  day_of_week INT,
  is_working BOOLEAN,
  PRIMARY KEY (schedule_id, day_of_week)
);

CREATE TABLE employee_schedule_assignment (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  schedule_id INT,
  start_date DATE,
  end_date DATE,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id)
);

CREATE TABLE shifts (
  shift_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  shift_date DATE,
  start_time TIME,
  end_time TIME,
  shift_type VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  date DATE,
  status VARCHAR(50),
  hours_worked DECIMAL(5,2),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE employee_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  change_type VARCHAR(50),
  old_value VARCHAR(100),
  new_value VARCHAR(100),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
