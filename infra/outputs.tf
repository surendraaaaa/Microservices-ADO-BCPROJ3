output "public_subnet_ids" {
  description = "Public subnet IDs per environment"
  value = {
    prod = module.vpc_prod.public_subnet_ids
    dr   = module.vpc_dr.public_subnet_ids
  }
}

output "private_subnet_ids" {
  description = "Private subnet IDs per environment"
  value = {
    prod = module.vpc_prod.private_subnet_ids
    dr   = module.vpc_dr.private_subnet_ids
  }
}

output "eks_cluster_ca_data" {
  description = "Cluster CA data per environment"
  value = {
    prod = module.eks_prod.kubeconfig_certificate_authority_data
    dr   = module.eks_dr.kubeconfig_certificate_authority_data
  }
}

output "eks_cluster_endpoints" {
  description = "Cluster API endpoints per environment"
  value = {
    prod = module.eks_prod.endpoint
    dr   = module.eks_dr.endpoint
  }
}

output "eks_cluster_names" {
  description = "Cluster names per environment"
  value = {
    prod = module.eks_prod.cluster_name
    dr   = module.eks_dr.cluster_name
  }
}
