import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getServerT } from "@/lib/i18n-server";

export default function ContactPage() {
  const { t } = getServerT();
  const items = [
    { icon: Mail, title: t("contact.email"), detail: "info@kurumalink.com", sub: t("contact.emailSub") },
    { icon: Phone, title: t("contact.phone"), detail: "+81 3-1234-5678", sub: t("contact.phoneSub") },
    { icon: MapPin, title: t("contact.office"), detail: t("contact.officeDetail"), sub: t("contact.officeSub") },
    { icon: Clock, title: t("contact.businessHours"), detail: t("contact.businessHoursDetail"), sub: t("contact.businessHoursSub") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-ink">{t("contact.title")}</h1>
        <p className="text-sm text-ink-muted mt-2">{t("contact.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          {items.map((item) => (
            <Card key={item.title}>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="h-10 w-10 rounded-xl bg-accent-soft flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-sm">{item.title}</h3>
                  <p className="text-ink mt-0.5">{item.detail}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{item.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="font-semibold text-ink text-lg mb-4">{t("contact.sendMessage")}</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ink-soft">{t("contact.firstName")}</label>
                  <input className="input" placeholder="John" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ink-soft">{t("contact.lastName")}</label>
                  <input className="input" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink-soft">{t("contact.email")}</label>
                <input type="email" className="input" placeholder="john@example.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink-soft">{t("contact.subject")}</label>
                <input className="input" placeholder={t("contact.subjectPlaceholder")} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-ink-soft">{t("contact.message")}</label>
                <textarea className="input min-h-[120px] resize-none" placeholder={t("contact.messagePlaceholder")} />
              </div>
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-lg font-medium transition-colors"
              >
                {t("contact.send")}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
