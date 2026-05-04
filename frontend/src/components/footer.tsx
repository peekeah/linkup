"use client";

import { 
  IconBrandTwitter, 
  IconBrandLinkedin, 
  IconBrandGithub, 
  IconBrandInstagram,
  IconMail,
} from "@tabler/icons-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Integrations", href: "#integrations" },
    { label: "API", href: "#api" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Careers", href: "#careers" },
    { label: "Press", href: "#press" },
  ],
  resources: [
    { label: "Documentation", href: "#docs" },
    { label: "Help Center", href: "#help" },
    { label: "Community", href: "#community" },
    { label: "Status", href: "#status" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookie Policy", href: "#cookies" },
    { label: "GDPR", href: "#gdpr" },
  ],
};

const socialLinks = [
  { icon: <IconBrandTwitter className="h-5 w-5" />, href: "#", label: "Twitter" },
  { icon: <IconBrandLinkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
  { icon: <IconBrandGithub className="h-5 w-5" />, href: "#", label: "GitHub" },
  { icon: <IconBrandInstagram className="h-5 w-5" />, href: "#", label: "Instagram" },
];

export const Footer = () => {

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="text-2xl font-bold mb-4">
                <span className="text-secondary">Link</span>
                <span className="text-muted-foreground">up</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Connect with like-minded people and build meaningful communities. 
                Your space for focused conversations and genuine connections.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Linkup. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Support
              </a>
              <div className="flex items-center gap-2">
                <IconMail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">hello@linkup.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
