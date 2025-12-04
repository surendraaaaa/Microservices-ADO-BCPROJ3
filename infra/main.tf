# main.tf

# -------------------------------
# VPCs
# -------------------------------
module "vpc_prod" {
  source    = "./modules/vpc"
  providers = { aws = aws.prod }

  name_prefix          = local.envs.prod.name_prefix
  vpc_cidr             = local.envs.prod.vpc_cidr
  azs                  = local.envs.prod.azs
  public_subnet_cidrs  = local.envs.prod.public_subnet_cidrs
  private_subnet_cidrs = local.envs.prod.private_subnet_cidrs

  tags = {
    Environment = "prod"
    Terraform   = "true"
  }
}

module "vpc_dr" {
  source    = "./modules/vpc"
  providers = { aws = aws.dr }

  name_prefix          = local.envs.dr.name_prefix
  vpc_cidr             = local.envs.dr.vpc_cidr
  azs                  = local.envs.dr.azs
  public_subnet_cidrs  = local.envs.dr.public_subnet_cidrs
  private_subnet_cidrs = local.envs.dr.private_subnet_cidrs

  tags = {
    Environment = "dr"
    Terraform   = "true"
  }
}

# -------------------------------
# EKS clusters
# -------------------------------
module "eks_prod" {
  source    = "./modules/eks"
  providers = { aws = aws.prod }

  name_prefix        = local.envs.prod.name_prefix
  cluster_name       = local.envs.prod.cluster_name
  region             = local.envs.prod.aws_region
  vpc_id             = module.vpc_prod.vpc_id
  private_subnet_ids = module.vpc_prod.private_subnet_ids
  public_subnet_ids  = module.vpc_prod.public_subnet_ids

  node_group_desired = var.node_group_desired
  node_group_min     = var.node_group_min
  node_group_max     = var.node_group_max
  instance_types     = var.instance_types
  key_name           = var.key_name

  tags = {
    Environment = "prod"
    Terraform   = "true"
  }
}

module "eks_dr" {
  source    = "./modules/eks"
  providers = { aws = aws.dr }

  name_prefix        = local.envs.dr.name_prefix
  cluster_name       = local.envs.dr.cluster_name
  region             = local.envs.dr.aws_region
  vpc_id             = module.vpc_dr.vpc_id
  private_subnet_ids = module.vpc_dr.private_subnet_ids
  public_subnet_ids  = module.vpc_dr.public_subnet_ids

  node_group_desired = var.node_group_desired
  node_group_min     = var.node_group_min
  node_group_max     = var.node_group_max
  instance_types     = var.instance_types
  key_name           = var.key_name

  tags = {
    Environment = "dr"
    Terraform   = "true"
  }
}
