"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type ServiceId = "tattoo" | "piercing" | "coverup";
type Service = {
  id: ServiceId;
  name: string;
  summary: string;
  photo: string;
  photoAlt: string;
  caption: string;
  heading: string;
  description: string;
  points: string[];
  appointmentLabel: string;
  portfolio?: boolean;
};
const services: Service[] = [
  {
    id: "tattoo",
    name: "Tattoo",
    summary:
      "Kişiye özel tasarım, stil seçimi, sanatçı eşleştirmesi ve uygulama.",
    photo: "/assets/work1.jpg",
    photoAlt: "Stüdyo duvarından arşiv fotoğrafı",
    caption: "Stüdyo arşivi · temsili",
    heading: "Fikirden uygulamaya.",
    description:
      "Tattoo yalnızca bir görseli ten üzerine aktarmak değil; fikrin, yerleşimin, ölçünün ve stilin birlikte netleştiği bir süreç.",
    points: [
      "Referans veya fikir üzerinden ön görüşme",
      "Stil ve sanatçı eşleştirmesi",
      "Yerleşim / ölçü / kompozisyon değerlendirmesi",
      "Uygulama sonrası bakım yönlendirmesi",
    ],
    appointmentLabel: "Tattoo Randevusu",
    portfolio: true,
  },
  {
    id: "piercing",
    name: "Piercing",
    summary: "Uygulama, takı seçenekleri ve bakım bilgileri.",
    photo: "/assets/studio2.jpg",
    photoAlt: "Piercing açıklaması için geçici stüdyo fotoğrafı",
    caption: "Stüdyo arşivi · geçici görsel",
    heading: "Uygulama kadar bakım da önemli.",
    description:
      "Piercing sürecinde işlem türü, uygun takı, yerleşim ve bakım adımları birlikte değerlendirilir. Uygulamadan önce beklentiler netleştirilir, sonrasında bakım bilgileri paylaşılır.",
    points: [
      "Piercing türü ve yerleşim seçimi",
      "Takı alternatifleri",
      "İyileşme sürecine dair temel bilgilendirme",
      "Bakım ve kontrol yönlendirmesi",
    ],
    appointmentLabel: "Piercing Randevusu",
  },
  {
    id: "coverup",
    name: "Cover Up",
    summary: "Eski dövmeyi analiz ederek kapatma veya yeniden yorumlama.",
    photo: "/assets/work4.jpg",
    photoAlt: "Stüdyo duvarındaki çizimler",
    caption: "Stüdyo arşivi · temsili",
    heading: "Her eski dövme aynı şekilde kapanmaz.",
    description:
      "İlk adım mevcut dövmeyi görmek. Renk yoğunluğu, boyut, konum ve yeni tasarımın ne kadar serbest hareket edebileceği değerlendirilir.",
    points: [
      "Mevcut dövmenin fotoğrafla değerlendirilmesi",
      "Kapatılabilir alan ve tasarım sınırları",
      "Yeni tasarım için yönlendirme",
      "Gerekirse yüz yüze ön görüşme",
    ],
    appointmentLabel: "Cover-Up Görüşmesi",
  },
];
export function ServicesPage() {
  const [open, setOpen] = useState<ServiceId | null>(null);
  useEffect(() => {
    const sync = () => {
      const hash = location.hash.slice(1);
      setOpen(services.some((s) => s.id === hash) ? (hash as ServiceId) : null);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const toggle = (id: ServiceId) => {
    const next = open === id ? null : id;
    setOpen(next);
    history.replaceState(
      null,
      "",
      next ? `#${id}` : `${location.pathname}${location.search}`,
    );
  };
  return (
    <main className="services-page">
      <section className="pagehero">
        <div className="container">
          <div className="crumb">ANASAYFA / HİZMETLER</div>
          <div className="eyebrow">HİZMETLER</div>
          <h1>Ne yapıyoruz?</h1>
          <p>
            Bir hizmeti seçtiğinde önce ne olduğunu, sürecin nasıl ilerlediğini
            ve randevudan önce ne hazırlaman gerektiğini görürsün.
          </p>
        </div>
      </section>
      <section className="service-list">
        {services.map((service, index) => (
          <article
            key={service.id}
            id={service.id}
            className={`service-row reveal${index ? " d" + index : ""}${open === service.id ? " open" : ""}`}
          >
            <button
              className="service-trigger"
              type="button"
              aria-controls={`service-${service.id}-detail`}
              aria-expanded={open === service.id}
              onClick={() => toggle(service.id)}
            >
              <span className="num">{String(index + 1).padStart(2, "0")}</span>
              <strong>{service.name}</strong>
              <span className="summary">{service.summary}</span>
              <span className="arrow">→</span>
            </button>
            <div
              id={`service-${service.id}-detail`}
              className="service-detail"
              inert={open !== service.id}
            >
              <figure className="service-visual">
                <img
                  src={service.photo}
                  alt={service.photoAlt}
                  loading="lazy"
                  decoding="async"
                  data-lightbox-image
                  role="button"
                  tabIndex={0}
                  aria-label={`${service.photoAlt} görselini büyüt`}
                />
                <figcaption>{service.caption}</figcaption>
              </figure>
              <div className="service-copy">
                <div className="eyebrow">
                  {service.name.toLocaleUpperCase("tr-TR")} / DETAY
                </div>
                <h3>{service.heading}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="service-actions">
                  <Link
                    className="btn purple"
                    href={`/appointment/?service=${service.id}`}
                  >
                    {service.appointmentLabel}
                  </Link>
                  {service.portfolio && (
                    <Link className="btn outline" href="/portfolio/">
                      İşleri Gör
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
