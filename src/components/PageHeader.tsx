import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

const PageHeader = ({ title, showBack = true }: PageHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-8 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          {showBack && (
            <Link to="/">
              <Button variant="secondary" size="lg" className="gap-2">
                <ArrowRight className="w-5 h-5" />
                العودة للرئيسية
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
