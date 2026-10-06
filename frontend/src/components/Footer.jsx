import React from "react";
import { Link } from "react-router-dom";
import { Youtube, Twitter, CreditCard, Apple, Wallet } from "lucide-react";

const DiscordIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

const colA = [
  { label: "Home", to: "/" },
  { label: "Support", to: "/" },
  { label: "Privacy Policy", to: "/" },
  { label: "Terms of Service", to: "/" },
];
const colB = [
  { label: "Market", to: "/" },
  { label: "History", to: "/orders" },
  { label: "Affiliate", to: "/" },
  { label: "Claims", to: "/" },
];

const PayChip = ({ icon: Icon, label }) => (
  <span className="flex items-center gap-1.5 rounded-md bg-white/95 text-[#101014] px-2.5 h-8 text-[11px] font-bold tracking-tight">
    <Icon size={14} /> {label}
  </span>
);

const Footer = () => (
  <footer data-testid="site-footer" className="mt-16 border-t border-border bg-[#0b0b0e]">
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pt-12 pb-10">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-8">
        <div className="col-span-2 md:col-span-1">
          <img src="/adurite-logo.png" alt="adurite" className="h-8 w-auto" />
        </div>

        <nav className="flex flex-col gap-4">
          {colA.map((l) => (
            <Link key={l.label} to={l.to} data-testid={`footer-link-${l.label.toLowerCase().replace(/ /g, "-")}`} className="text-[15px] text-gray-300 hover:text-primary transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-4">
          {colB.map((l) => (
            <Link key={l.label} to={l.to} data-testid={`footer-link-${l.label.toLowerCase()}`} className="text-[15px] text-gray-300 hover:text-primary transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div>
          <div className="text-[15px] text-gray-300 mb-4">Socials</div>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" data-testid="footer-social-discord" className="hover:text-primary transition-colors"><DiscordIcon /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" data-testid="footer-social-twitter" className="hover:text-primary transition-colors"><Twitter size={22} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" data-testid="footer-social-youtube" className="hover:text-primary transition-colors"><Youtube size={24} /></a>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 md:text-right">
          <div className="text-[15px] text-gray-200">Email: <a href="mailto:help@adurite.com" className="hover:text-primary transition-colors">help@adurite.com</a></div>
          <div className="text-[15px] font-semibold text-white mt-2">Main Business Address</div>
          <div data-testid="footer-address" className="text-[14px] text-gray-500 leading-relaxed mt-1">
            2026 ADURITE LIMITED<br />
            Suite 14, 2/F., Marlowe Exchange,<br />
            48 Harbour Crescent, Saint Ives,<br />
            Port Caldera, Isle of Verra VR1180
          </div>
          <div className="flex md:justify-end items-center gap-2 mt-5">
            <PayChip icon={Wallet} label="CRYPTO" />
            <PayChip icon={Apple} label="PAY" />
            <PayChip icon={CreditCard} label="CARD" />
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-[15px] text-gray-300">
        Adurite © {new Date().getFullYear()} — Not affiliated in any way with the Roblox Corporation or any of its trademarks.
      </div>
      <p className="mt-5 max-w-[1250px] mx-auto text-center text-[14px] leading-relaxed text-gray-400">
        Adurite is an independent, community-run marketplace where players trade limited in-game items directly with one another.
        We are not a Roblox Corporation product and have no sponsorship, affiliation, endorsement or approval from them. Every
        item here is delivered through a player-to-player trade between members of this site, never by the platform itself.
      </p>
    </div>
  </footer>
);

export default Footer;
