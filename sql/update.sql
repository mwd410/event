CREATE TABLE IF NOT EXISTS namespace (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
)
    ENGINE =InnoDB
;

CREATE TABLE IF NOT EXISTS eventName (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    namespaceId INT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    UNIQUE KEY (namespaceId, name),
    CONSTRAINT eventName_namespaceId
    FOREIGN KEY (namespaceId)
    REFERENCES namespace (id)
)
    ENGINE =InnoDB
;
