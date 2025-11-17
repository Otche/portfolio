# Configuration du Provider AWS
provider "aws" {
  region = "eu-west-3" # Région fixée ici
}

# Pré-requis : Trouver le VPC par défaut (simplification)
data "aws_vpc" "default" {
  default = true
}

# -----------------
# 1. GÉNÉRATION LOCALE DE LA CLÉ SSH
# -----------------
resource "tls_private_key" "ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_file" "private_key" {
  content  = tls_private_key.ssh_key.private_key_pem
  filename = "portolio-server-key.pem"
}

# -----------------
# 2. APPEL DU MODULE SECURITY GROUP
# -----------------
module "sg" {
  source  = "./modules/security_group" # Chemin vers le répertoire du module SG
  vpc_id  = data.aws_vpc.default.id
  sg_name = "ubuntu-web-sg"
}

# -----------------
# 3. APPEL DU MODULE EC2 (L'ASSOCIATION)
# -----------------
module "web_instance" {
  source = "./modules/ec2" # Chemin vers le répertoire du module EC2

  instance_name       = "portfolio-web-server"
  instance_type       = "t2.nano"
  key_name            = "ec2-key-module"
  public_key          = tls_private_key.ssh_key.public_key_openssh
  
  # L'ASSOCIATION : On passe l'output du module 'sg' en input au module 'web_instance'
  security_group_id   = module.sg.security_group_id 
}