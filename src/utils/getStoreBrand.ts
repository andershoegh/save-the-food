export function getStoreBrandLogo(brand: string) {
  switch (brand) {
    case "foetex":
      return "/foetex.png"
    case "netto":
      return "/netto.png"
    case "bilka":
      return "/bilka.png"
    default:
      return "/missingBrandImage.png"
  }
}
