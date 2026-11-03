const API_BASE = "https://uat.gatewayabroadeducations.com/api/v1";

async function getJson(path: string) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function featuredPages(result: any) {
  return Array.isArray(result?.data) ? result.data : [];
}

export async function getSiteNavigationData() {
  const [countriesResult, coursesResult, citiesResult] = await Promise.all([
    getJson("/page/list/type?type=country_page&featured=true"),
    getJson("/page/list/type?type=course_page&featured=true"),
    getJson("/page/list/type?type=city_page&featured=true"),
  ]);

  return {
    countries: featuredPages(countriesResult),
    courses: featuredPages(coursesResult),
    cities: featuredPages(citiesResult),
  };
}
