import type { ReactNode } from 'react';

const footerLinkClass =
  'text-sm text-muted-foreground hover:text-foreground transition-colors';

const FooterLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className={footerLinkClass}>
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Car Doctor. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <FooterLink href="#privacy">Privacy Policy</FooterLink>
            <FooterLink href="#terms">Terms of Service</FooterLink>
            {/* Filled in at release time by scripts/update_commit_hash.sh */}
            <span className="text-sm text-muted-foreground" id="commit-hash">ab7384a</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
