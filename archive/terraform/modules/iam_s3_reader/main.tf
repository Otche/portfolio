# main.tf du module iam_s3_reader
# 1. Politique de Confiance (Assume Role Policy)
# Permet au service EC2 d'assumer ce rôle.
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

# 2. Rôle IAM
resource "aws_iam_role" "s3_reader_role" {
  name               = var.role_name
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

# 3. Politique d'Accès S3 (Lecture seule sur TOUS les buckets)
data "aws_iam_policy_document" "s3_read_access" {
  statement {
    effect = "Allow"
    actions = [
      "s3:Get*",
      "s3:List*"
    ]
    # L'astérisque permet l'accès à toutes les ressources (tous les buckets et objets)
    resources = ["arn:aws:s3:::*"] 
  }
}

# 4. Attacher la Politique d'Accès au Rôle
resource "aws_iam_role_policy" "s3_reader_policy" {
  name   = "${var.role_name}-s3-read-policy"
  role   = aws_iam_role.s3_reader_role.id
  policy = data.aws_iam_policy_document.s3_read_access.json
}

# 5. Profil d'Instance (Le conteneur que l'EC2 utilise pour assumer le Rôle)
resource "aws_iam_instance_profile" "s3_reader_profile" {
  name = var.profile_name
  role = aws_iam_role.s3_reader_role.name
}