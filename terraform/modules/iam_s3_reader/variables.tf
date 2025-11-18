variable "role_name" {
  description = "Nom du Rôle IAM pour la lecture de S3."
  type        = string
  default     = "EC2-S3-Reader-Role"
}

variable "profile_name" {
  description = "Nom du Profil d'Instance attaché à l'EC2."
  type        = string
  default     = "EC2-S3-Reader-Profile"
}