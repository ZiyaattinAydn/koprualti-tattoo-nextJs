"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ServiceId = "tattoo" | "piercing" | "coverup";
type DetailSection = {
  title: string;
  text: string;
  items?: string[];
};
type Service = {
  id: ServiceId;
  slug: "tattoo" | "piercing" | "cover-up";
  name: string;
  summary: string;
  photo: string;
  photoAlt: string;
  caption: string;
  heading: string;
  description: string;
  sections: DetailSection[];
  appointmentLabel: string;
  portfolio?: boolean;
};

const services: Service[] = [
  {
    id: "tattoo",
    slug: "tattoo",
    name: "Tattoo",
    summary:
      "Kişiye özel tasarım, stil seçimi, sanatçı eşleştirmesi ve uygulama.",
    photo: "/assets/work1.jpg",
    photoAlt: "Köprüaltı Tattoo stüdyo arşivinden dövme çalışması",
    caption: "Köprüaltı arşivi · tattoo",
    heading: "Fikirden uygulamaya, tek bir çizgide değil bir süreçte.",
    description:
      "Tattoo; fikrin, vücut yerleşiminin, ölçünün, stilin ve sanatçının birlikte değerlendirildiği kişisel bir çalışma sürecidir. Köprüaltı'nda amaç yalnızca bir görseli tene aktarmak değil, fikri doğru kompozisyon ve teknikle kalıcı hale getirmektir.",
    sections: [
      {
        title: "Tattoo nedir?",
        text: "Dövme, pigmentin kontrollü biçimde cilt altına uygulanmasıyla oluşturulan kalıcı beden sanatıdır. Tasarım kadar uygulama tekniği, yerleşim ve iyileşme süreci de sonucun parçasıdır.",
      },
      {
        title: "Kısa tarihçe",
        text: "Dövme binlerce yıldır kimlik, aidiyet, ritüel ve estetik anlatım için kullanılıyor. Günümüzde geleneksel köklerle çağdaş illüstrasyon ve kişisel tasarım dili aynı stüdyoda buluşabiliyor.",
      },
      {
        title: "Stil çeşitleri",
        text: "Her fikir aynı teknikle çözülmez.",
        items: [
          "Fine line ve minimal",
          "Blackwork ve black & grey",
          "Traditional / neo-traditional",
          "Realism ve illustrative",
          "Lettering ve kişisel semboller",
        ],
      },
      {
        title: "Köprüaltı yaklaşımı",
        text: "Referansı birebir kopyalamak yerine fikrin sana, bölgeye ve seçilen sanatçının diline uyarlanması hedeflenir. Gerekirse sanatçı eşleştirmesi ön görüşmede netleştirilir.",
      },
      {
        title: "Süreç nasıl işler?",
        text: "Ön görüşmede fikir, stil, yerleşim, ölçü ve referanslar konuşulur. Uygun sanatçı ve şube belirlendikten sonra tasarım ve uygulama planı netleşir.",
        items: [
          "Fikir ve referans paylaşımı",
          "Sanatçı / stil eşleştirmesi",
          "Yerleşim ve ölçü kararı",
          "Uygulama",
          "Bakım yönlendirmesi",
        ],
      },
      {
        title: "Bakım",
        text: "İyileşme süreci kişiden kişiye ve uygulama bölgesine göre değişebilir. Uygulama sonrası verilen bakım önerileri takip edilmeli; olağan dışı bir durumda stüdyoyla iletişime geçilmelidir.",
      },
    ],
    appointmentLabel: "Tattoo Randevusu",
    portfolio: true,
  },
  {
    id: "piercing",
    slug: "piercing",
    name: "Piercing",
    summary: "Uygulama, takı seçenekleri, hijyen ve bakım bilgileri.",
    photo: "/assets/studio2.jpg",
    photoAlt: "Köprüaltı stüdyo alanı",
    caption: "Köprüaltı arşivi · piercing için stüdyo görseli",
    heading: "Doğru yerleşim kadar doğru bakım da önemli.",
    description:
      "Piercing işleminde bölge seçimi, anatomik uygunluk, takı tercihi, hijyen ve iyileşme süreci birlikte değerlendirilir. Uygulama öncesi beklenti netleşir; işlem sonrası bakım bilgileri paylaşılır.",
    sections: [
      {
        title: "Piercing nedir?",
        text: "Piercing, vücudun uygun bir bölgesinde kontrollü kanal oluşturulup bu alana uygun takı yerleştirilmesidir. Anatomik uygunluk ve doğru takı seçimi sürecin temel parçalarıdır.",
      },
      {
        title: "Kısa tarihçe",
        text: "Piercing farklı kültürlerde ritüel, kimlik ve süslenme amacıyla yüzyıllardır kullanılıyor. Modern stüdyo pratiğinde bu gelenek hijyen standartları ve çağdaş takı seçenekleriyle devam ediyor.",
      },
      {
        title: "Türler",
        text: "Uygunluk bölgeye ve kişisel anatomiye göre değerlendirilir.",
        items: [
          "Kulak ve kıkırdak uygulamaları",
          "Burun uygulamaları",
          "Dudak ve yüz bölgesi",
          "Göbek ve diğer uygun bölgeler",
        ],
      },
      {
        title: "Hijyen",
        text: "İşlem alanı, kullanılan ekipman ve takı seçimi hijyen odağında ele alınır. Tek kullanımlık malzemeler işlem sırasında uygun şekilde kullanılır.",
      },
      {
        title: "Uygulama ve iyileşme",
        text: "İşlem öncesinde bölge değerlendirilir ve yerleşim işaretlenir. İyileşme süresi bölgeye göre değişir; ilk dönemde gereksiz temas ve takıyla oynama iyileşmeyi zorlaştırabilir.",
      },
      {
        title: "Bakım",
        text: "Bakım rutini uygulama bölgesine göre anlatılır. Takıyı erken değiştirmemek ve stüdyonun verdiği kontrol önerilerini takip etmek önemlidir.",
      },
    ],
    appointmentLabel: "Piercing Randevusu",
  },
  {
    id: "coverup",
    slug: "cover-up",
    name: "Cover-Up",
    summary: "Eski dövmeyi analiz ederek kapatma veya yeniden yorumlama.",
    photo: "/assets/work4.jpg",
    photoAlt: "Köprüaltı dövme arşivinden cover-up için temsili çalışma",
    caption: "Köprüaltı arşivi · cover-up için temsili",
    heading: "Her eski dövme aynı şekilde kapanmaz.",
    description:
      "Cover-Up, mevcut dövmeyi yalnızca daha koyu bir tasarımla örtmek değildir. Eski işin rengi, yoğunluğu, boyutu, konumu ve yeni tasarımın hareket alanı birlikte değerlendirilir.",
    sections: [
      {
        title: "Cover-Up nedir?",
        text: "Mevcut dövmeyi yeni bir kompozisyonun parçası haline getirerek görünürlüğünü azaltan veya tamamen kapatan yeniden tasarım sürecidir.",
      },
      {
        title: "Hangi dövmeler kapatılabilir?",
        text: "Sonuç mevcut pigment yoğunluğuna ve tasarımın yapısına bağlıdır. Bazı işler doğrudan kapatılabilirken bazıları daha büyük, daha koyu veya farklı bir kompozisyon gerektirebilir.",
        items: [
          "Solmuş veya küçük çalışmalar",
          "Yerleşimi yeni kompozisyona izin veren dövmeler",
          "Renk ve yoğunluğu tasarımla dengelenebilen işler",
          "Gerekirse aşamalı çözüm gerektiren dövmeler",
        ],
      },
      {
        title: "Tasarım süreci",
        text: "İlk değerlendirme için mevcut dövmenin net, gün ışığında çekilmiş fotoğrafı önemlidir. Sonrasında yeni fikrin yönü, kaplama alanı ve stil birlikte planlanır.",
      },
      {
        title: "Öncesi / sonrası",
        text: "Cover-Up kararını verirken yalnızca yeni tasarıma değil, eski işin yeni kompozisyonda nasıl kaybolduğuna bakılır. Uygun arşiv görselleri geldikçe bu alan gerçek öncesi / sonrası örnekleriyle genişletilebilir.",
      },
      {
        title: "Portfolio",
        text: "Köprüaltı portfolyosunda sanatçıların mevcut çalışmalarını inceleyebilir, kendi fikrine yaklaşan stil ve uygulamaları referans olarak kullanabilirsin.",
      },
    ],
    appointmentLabel: "Cover-Up Görüşmesi",
    portfolio: true,
  },
];

export function ServicesPage({ initialService = null }: { initialService?: ServiceId | null }) {
  const [open, setOpen] = useState<ServiceId | null>(initialService);

  useEffect(() => {
    const sync = () => {
      const hash = location.hash.slice(1);
      if (services.some((service) => service.id === hash)) {
        setOpen(hash as ServiceId);
        requestAnimationFrame(() =>
          document.getElementById(hash)?.scrollIntoView({
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
            block: "start",
          }),
        );
        return;
      }
      if (initialService) {
        setOpen(initialService);
        requestAnimationFrame(() =>
          document.getElementById(initialService)?.scrollIntoView({
            behavior: "auto",
            block: "start",
          }),
        );
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [initialService]);

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
    <main className="services-page services-page-s3">
      <section className="pagehero services-s3-hero">
        <div className="container">
          <div className="crumb">ANASAYFA / HİZMETLER</div>
          <div className="eyebrow">03 / HİZMETLER</div>
          <h1>Ne yapıyoruz?</h1>
          <p>
            Tattoo, piercing ve cover-up için yalnızca başlık değil; süreç,
            hazırlık, bakım ve randevu kararını tek yerde görebileceğin daha
            açıklayıcı bir yapı.
          </p>
          <nav className="services-s3-shortcuts" aria-label="Hizmet kısayolları">
            {services.map((service) => (
              <Link key={service.id} href={`/services/${service.slug}/`}>
                <span>{service.name}</span>
                <b>↗</b>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="service-list services-s3-list">
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
              className="service-detail services-s3-detail"
              inert={open !== service.id}
            >
              <div className="services-s3-intro-grid">
                <figure className="service-visual services-s3-visual">
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
                <div className="service-copy services-s3-copy">
                  <div className="eyebrow">
                    {service.name.toLocaleUpperCase("tr-TR")} / DETAY
                  </div>
                  <h2>{service.heading}</h2>
                  <p>{service.description}</p>
                  <div className="service-actions">
                    <Link
                      className="btn purple"
                      href={`/appointment/?service=${service.id}`}
                    >
                      {service.appointmentLabel}
                    </Link>
                    {service.portfolio && (
                      <Link className="btn outline" href="/portfolio/">
                        Portfolio
                      </Link>
                    )}
                    <Link className="btn outline" href={`/services/${service.slug}/`}>
                      Sabit bağlantı
                    </Link>
                  </div>
                </div>
              </div>

              <div className="services-s3-sections">
                {service.sections.map((section, sectionIndex) => (
                  <section key={section.title} className="services-s3-section-card">
                    <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{section.title}</h3>
                      <p>{section.text}</p>
                      {section.items && (
                        <ul>
                          {section.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </section>
                ))}
              </div>

              <div className="services-s3-bottom-cta">
                <div>
                  <span className="eyebrow">SONRAKİ ADIM</span>
                  <h3>Fikrini randevuya dönüştür.</h3>
                  <p>
                    Hizmeti, sanatçıyı ve şubeyi seç; detayları randevu akışında
                    birlikte toparlayalım.
                  </p>
                </div>
                <Link className="btn purple" href={`/appointment/?service=${service.id}`}>
                  Randevu Akışına Geç ↗
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
