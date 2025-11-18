variable "instance_name" {
  description = "Le nom de l'instance EC2."
  type        = string
}

variable "instance_type" {
  description = "Le type d'instance EC2."
  type        = string
}

variable "key_name" {
  description = "Le nom de la paire de clés SSH."
  type        = string
}

variable "public_key" {
  description = "La clé publique SSH (ex: à partir d'un tls_private_key local)."
  type        = string
}

variable "security_group_id" {
  description = "L'ID du Security Group à attacher à l'instance. (LE LIEN CRUCIAL)"
  type        = string
}

variable "ami_id" {
  description = "L'ID de l'AMI à utiliser pour l'instance EC2."
  type        = string
}