# providers.tf
provider "aws" {
  region = local.envs.prod.aws_region
  alias  = "prod"
}

provider "aws" {
  region = local.envs.dr.aws_region
  alias  = "dr"
}
