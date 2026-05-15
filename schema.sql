CREATE DATABASE IF NOT EXISTS wexi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wexi;

CREATE TABLE IF NOT EXISTS users (
  id      VARCHAR(36) PRIMARY KEY,
  email   VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name    VARCHAR(255) NOT NULL,
  role    ENUM('comprador','vendedor','admin') NOT NULL DEFAULT 'comprador',
  photo   MEDIUMTEXT,
  coins   INT NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id          VARCHAR(36) PRIMARY KEY,
  seller_id   VARCHAR(36) NOT NULL,
  seller_name VARCHAR(255) NOT NULL,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  price       DECIMAL(10,2) NOT NULL,
  category    VARCHAR(100),
  image_url   VARCHAR(512),
  available   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id             VARCHAR(36) PRIMARY KEY,
  buyer_id       VARCHAR(36) NOT NULL,
  buyer_name     VARCHAR(255) NOT NULL,
  seller_id      VARCHAR(36) NOT NULL,
  seller_name    VARCHAR(255) NOT NULL,
  total          DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status         ENUM('pending','processing','delivered','cancelled') NOT NULL DEFAULT 'pending',
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  order_id    VARCHAR(36) NOT NULL,
  product_id  VARCHAR(36),
  name        VARCHAR(255) NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  qty         INT NOT NULL,
  image_url   VARCHAR(512),
  seller_id   VARCHAR(36),
  seller_name VARCHAR(255),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  order_id    VARCHAR(36) NOT NULL,
  sender_id   VARCHAR(36) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_role VARCHAR(50),
  text        TEXT NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS coin_packages (
  id         VARCHAR(36) PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  coins      INT NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coin_transactions (
  id         VARCHAR(36) PRIMARY KEY,
  user_id    VARCHAR(36) NOT NULL,
  package_id VARCHAR(36),
  coins      INT NOT NULL,
  amount     DECIMAL(10,2),
  reason     TEXT,
  type       VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  `key`   VARCHAR(100) PRIMARY KEY,
  `value` MEDIUMTEXT
);

INSERT IGNORE INTO settings (`key`, `value`) VALUES ('qrImageUrl', '');
