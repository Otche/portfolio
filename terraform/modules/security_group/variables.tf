variable "vpc_id" {
  description = "L'ID du VPC où déployer le SG (requis)."
  type        = string
}

variable "sg_name" {
  description = "Le nom du Security Group."
  type        = string
}