# main.tf du module s3_bucket

resource "aws_s3_bucket" "this" {
  # Utilise le nom passé par le module racine
  bucket = var.bucket_name
  
  tags = {
    Environment = var.environment
  }
}

# Bloc de propriété publique (bloque l'accès public pour la sécurité par défaut)
resource "aws_s3_bucket_public_access_block" "block" {
  bucket                  = aws_s3_bucket.this.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}