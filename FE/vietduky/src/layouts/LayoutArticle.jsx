import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import BannerArticle from "@/components/Article/BannerArticle/BannerArticle";
import BreadCrumbArticle from "@/components/Article/BreadCrumbArticle/BreadCrumbArticle";

export default function LayoutArticle({ children, sidebar }) {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Banner */}
      <BannerArticle />

      {/* Breadcrumb */}
      <BreadCrumbArticle />

      {/* Main layout */}
      <main className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Main content (left) */}
        <div className="w-full lg:w-3/4">{children}</div>

        {/* SidebarAdmin (right) */}
        <aside className="w-full lg:w-1/4">{sidebar}</aside>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
