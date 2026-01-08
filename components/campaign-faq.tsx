"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { HelpCircle, ChevronDown, ChevronUp, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is a campaign?",
    answer: "A campaign is a traffic generation configuration that directs visitors to your website. You can set the target URL, daily page views, and other parameters to control how traffic is delivered."
  },
  {
    question: "How do I set the page views per day?",
    answer: "Use the slider to set your desired daily page views. The minimum is 10 views per day, and you can go up to 10,000 views per day. The value you set determines how much traffic your campaign will generate daily."
  },
  {
    question: "What happens after I create a campaign?",
    answer: "Once created, your campaign will start generating traffic according to your settings. You can monitor its performance, pause it, or modify it anytime from the campaign list page."
  },
  {
    question: "Can I edit a campaign after creation?",
    answer: "Yes, you can edit your campaign settings at any time. Navigate to the campaign detail page and click the edit button to modify any parameters including title, URLs, and page views."
  },
  {
    question: "What is the difference between Main URL and Target URL?",
    answer: "The Main URL is the primary destination for your campaign traffic. The Target URL is automatically set to the same value as the Main URL, ensuring all traffic goes to your specified destination."
  },
  // {
  //   question: "How long does it take for traffic to start?",
  //   answer: "Traffic typically starts flowing within a few minutes after campaign creation. The system distributes your daily page views throughout the day to provide natural-looking traffic patterns."
  // },
  // {
  //   question: "Can I pause a campaign?",
  //   answer: "Yes, you can pause any active campaign at any time. Paused campaigns stop generating traffic but retain all their settings, so you can resume them later without reconfiguration."
  // },
  // {
  //   question: "What happens if I exceed my plan limits?",
  //   answer: "If you exceed your plan's daily or monthly limits, the system will automatically pause your campaigns until your limits reset or you upgrade your plan."
  // }
];

export default function CampaignFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-5 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        {/* <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" /> */}
        <h2 className="text-xl font-semibold">FAQ's</h2>
      </div>
      
      <div className="space-y-3">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden transition-all"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <span className="text-md font-medium pr-4 flex items-center gap-2 ">
              <Target className="h-2 w-2" fill="currentColor" />
                {item.question}</span>
              {openIndex === index ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

