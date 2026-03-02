import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { XCircle, ArrowRight, RefreshCw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentFailed = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-12 max-w-md w-full text-center"
    >
      <XCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
      <h1 className="font-display text-3xl font-bold text-foreground mb-3">Payment Failed</h1>
      <p className="font-body text-sm text-muted-foreground mb-8">
        Something went wrong with your payment. Don't worry — you haven't been charged.
      </p>

      <div className="space-y-3">
        <Link to="/pricing">
          <Button className="w-full bg-gradient-gold text-primary-foreground font-body font-semibold py-5">
            <RefreshCw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </Link>
        <a href="mailto:support@profilex.in">
          <Button variant="outline" className="w-full font-body">
            <Mail className="w-4 h-4 mr-2" /> Contact Support
          </Button>
        </a>
      </div>

      <div className="mt-8 glass-gold rounded-lg p-4">
        <p className="font-body text-xs text-muted-foreground">
          <strong className="text-foreground">Common fixes:</strong> Check your card details, ensure sufficient balance, or try a different payment method.
        </p>
      </div>
    </motion.div>
  </div>
);

export default PaymentFailed;
