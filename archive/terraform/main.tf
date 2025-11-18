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
# 2.5 APPEL DU MODULE IAM S3 READER
# -----------------
module "iam_reader" {
  source = "./modules/iam_s3_reader"
  # Les valeurs par défaut seront utilisées si non spécifiées ici
}



# -----------------
# 3. APPEL DU MODULE EC2 (L'ASSOCIATION)
# -----------------
module "web_instance" {
  source = "./modules/ec2" # Chemin vers le répertoire du module EC2

  instance_name       = "portfolio-web-server"
  instance_type       = "t2.micro"
  key_name            = "portfolio-server-key"
  public_key          = tls_private_key.ssh_key.public_key_openssh
  ami_id              =  module.iam_reader.s3_reader_profile_name
  # L'ASSOCIATION : On passe l'output du module 'sg' en input au module 'web_instance'
  security_group_id   = module.sg.security_group_id 
}


# -----------------
# 4. APPEL DU MODULE S3 BUCKET
# -----------------
module "bucket_portfolio_api" {
  # Chemin relatif vers le répertoire du module
  source  = "./modules/s3_bucket" 
  # Valeurs à passer aux variables du module
  bucket_name          = "amine-ouchiha-portfolio-api" # REMPLACER PAR UN NOM UNIQUE GLOBAL
  environment          = "prod"
  versioning_enabled   = true
}

# Output pour afficher l'ARN du nouveau bucket
output "bucket_portfolio_api_storage_arn" {
  value = module.bucket_portfolio_api.bucket_arn
}

module "bucket_portfolio_site" {
  # Chemin relatif vers le répertoire du module
  source  = "./modules/s3_bucket" 
  # Valeurs à passer aux variables du module
  bucket_name          = "amine-ouchiha-portfolio-site" # REMPLACER PAR UN NOM UNIQUE GLOBAL
  environment          = "prod"
  versioning_enabled   = true
}

# Output pour afficher l'ARN du nouveau bucket
output "bucket_portfolio_site_storage_arn" {
  value = module.bucket_portfolio_site.bucket_arn
}

module "bucket_portfolio_nginx" {
  # Chemin relatif vers le répertoire du module
  source  = "./modules/s3_bucket" 
  # Valeurs à passer aux variables du module
  bucket_name          = "amine-ouchiha-portfolio-nginx" # REMPLACER PAR UN NOM UNIQUE GLOBAL
  environment          = "prod"
  versioning_enabled   = true
}

# Output pour afficher l'ARN du nouveau bucket
output "bucket_portfolio_nginx_storage_arn" {
  value = module.bucket_portfolio_nginx.bucket_arn
}

module "bucket_portfolio_docker" {
  # Chemin relatif vers le répertoire du module
  source  = "./modules/s3_bucket" 
  # Valeurs à passer aux variables du module
  bucket_name          = "amine-ouchiha-portfolio-docker" # REMPLACER PAR UN NOM UNIQUE GLOBAL
  environment          = "prod"
  versioning_enabled   = true
}

# Output pour afficher l'ARN du nouveau bucket
output "bucket_portfolio_docker_storage_arn" {
  value = module.bucket_portfolio_docker.bucket_arn
}