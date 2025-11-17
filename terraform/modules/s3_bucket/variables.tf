# variables.tf du module s3_bucket

variable "bucket_name" {
  description = "Nom unique du bucket S3 (doit être globalement unique)."
  type        = string
}

variable "environment" {
  description = "Environnement (ex: dev, staging, prod) pour les tags."
  type        = string
  default     = "prod"
}

variable "versioning_enabled" {
  description = "Activer ou désactiver le versioning du bucket."
  type        = bool
  default     = false
}