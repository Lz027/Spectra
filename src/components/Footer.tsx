import { motion } from "framer-motion";
import { Shield, Heart } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-auto border-t border-border"
    >
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/30 p-4">
          <Shield className="h-4 w-4 text-primary" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Ethically Curated.</span> All tools are
            vetted for ethical alignment before inclusion.
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
          </div>
          <div className="text-xs">© {new Date().getFullYear()} Spectra. All rights reserved.</div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
