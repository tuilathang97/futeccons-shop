"use client";

import Link from "next/link";
import { Building, Phone, Mail, MapPin, Facebook, Instagram,  } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerSections = [
  {
    title: "Dịch vụ",
    items: [
      { title: "Bán nhà", href: "/ban-nha" },
      { title: "Cho thuê", href: "/cho-thue" },
      { title: "Dự án", href: "/du-an" },
      { title: "Tin tức", href: "/tin-tuc" },
      { title: "Đăng tin", href: "/dang-tin" },
    ],
  },
  {
    title: "Hỗ trợ",
    items: [
      { title: "Liên hệ", href: "/lien-he" },
      { title: "Hướng dẫn", href: "/huong-dan" },
      { title: "Câu hỏi thường gặp", href: "/faq" },
      { title: "Báo cáo lỗi", href: "/bao-cao-loi" },
      { title: "Quy định đăng tin", href: "/quy-dinh" },
    ],
  },
  {
    title: "Về chúng tôi",
    items: [
      { title: "Giới thiệu", href: "/gioi-thieu" },
      { title: "Đối tác", href: "/doi-tac" },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/futeccons", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/futeccons", label: "Instagram" },
];

const contactInfo = [
  { icon: Phone, label: "Hotline", value: "0765563567" },
  { icon: Mail, label: "Email", value: "thanhlb1990@gmail.com" },
  { icon: MapPin, label: "Địa chỉ", value: "12/66/3 đường ấp 4, Đông Thạnh, Hóc Môn, Hồ Chí Minh" },
];

export default function Footer() {

return (
    <footer className="bg-brand-medium text-white min-w-full">
      <div className="py-12 xl:px-0 container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-medium rounded-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Fuland Shop</h3>
                <p className="text-brand-light text-sm">Nền tảng bất động sản hàng đầu</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Kết nối những cơ hội bất động sản tốt nhất. Chúng tôi cam kết mang đến 
              dịch vụ chuyên nghiệp và đáng tin cậy cho mọi giao dịch của bạn.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-gray-300">
                  <item.icon className="h-4 w-4 text-brand-light flex-shrink-0" />
                  <span className="font-medium">{item.label}:</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-brand-dark/50 hover:bg-brand-medium transition-colors duration-200 rounded-lg group"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors duration-200" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-lg font-semibold text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-brand-light transition-colors duration-200 text-sm"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      <Separator className="bg-brand-medium/20" />

      {/* Bottom Footer */}
      <div className="py-6 container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-gray-300">
          <div className="flex flex-col md:flex-row gap-4">
            <p>&copy; 2025 Fuland Shop. Tất cả quyền được bảo lưu.</p>
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="hover:text-brand-light transition-colors duration-200"
              >
                Điều khoản dịch vụ
              </Link>
              <Link
                href="/privacy"
                className="hover:text-brand-light transition-colors duration-200"
              >
                Chính sách bảo mật
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <span>Powered by</span>
            <span className="font-semibold text-brand-light">Futeccons Technology</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 