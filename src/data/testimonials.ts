// Client testimonials. `quote`, `quoteMobile` (shorter version for small screens) and `role` may contain inline HTML.
export type Testimonial = { imgClass?: string; name: string; quote: string; quoteMobile?: string; role: string; img: { src: string; srcset?: string; sizes?: string; alt: string; width?: string } };

export const testimonials: Record<string, Testimonial> = {
  "fabrizio-marino": {
    "imgClass": "is-anne",
    "name": "Fabrizio Marino",
    "quote": "From the day we relaunched we all felt <strong>a wave of new customers</strong> walking in the restaurant. Beyond that, the work done on the <strong>strategy and clarity was foundational for our growth</strong>.",
    "quoteMobile": "From the day we relaunched we all felt <strong>a wave of new customers</strong> walking in the restaurant.",
    "role": "Chef &amp; Founder <span class=\"purple_highlight\">Maggese</span>",
    "img": {
      "src": "/images/client_fabrizio.jpg",
      "alt": "Black and white photo of Chef Fabrizio Marino plating a dish in the Maggese kitchen.",
      "width": "400"
    }
  },
  "joseph-klatt": {
    "name": "Joseph Klatt",
    "quote": "I couldn't imagine working with someone more <strong>creative and professional</strong> than Mattia for our website.",
    "role": "Ex. CEO, <span class=\"purple_highlight\">Precious Plastic</span>",
    "img": {
      "src": "/images/client_joseph.webp",
      "alt": "A man with curly hair and a mustache, wearing glasses and a black shirt, smiling against a neutral background.",
      "width": "400"
    }
  },
  "sarah-wheeler": {
    "name": "Sarah Wheeler",
    "quote": "Mattia guided us through a <strong>full rebrand</strong> with a new logo, packaging, and website. Mattia <strong>listens deeply</strong>, leads meetings effectively, and delivers on time with integrity. He is calm under pressure, collaborative, and brings <strong>a rare mix of artistry and strategy.</strong>",
    "quoteMobile": "Mattia is calm under pressure, collaborative, and brings <strong>a rare mix of artistry and strategy.</strong>",
    "role": "Founder <span class=\"purple_highlight\">Pure Melt</span>",
    "img": {
      "src": "/images/client_sarah.webp",
      "alt": "A woman with long gray hair, wearing a brown shirt, standing outdoors with green foliage in the background. She is looking directly at the camera.",
      "width": "400"
    }
  },
  "annemarie-de-graaff": {
    "imgClass": "is-anne",
    "name": "Annemarie de Graaff",
    "quote": "Mattia quickly understood the vision and translated it into <strong>clear direction and strong design execution</strong>. Fast, reliable, and easy to work with. He gets things done (!) without overcomplicating.",
    "quoteMobile": "Mattia quickly understood the vision and translated it into <strong>clear direction and strong design execution</strong>.",
    "role": "Founder <span class=\"purple_highlight\">Genki Greens</span>",
    "img": {
      "src": "/images/client_anne.webp",
      "srcset": "/images/client_anne-p-500.webp 500w, /images/client_anne.webp 800w",
      "sizes": "(max-width: 479px) 100vw, 400px",
      "alt": "A woman stands with her arms crossed in front of a brick wall, wearing a black blazer over a white shirt, smiling at the camera.",
      "width": "400"
    }
  },
  "alf-wheeler": {
    "name": "Alf Wheeler",
    "quote": "Having Mattia <strong>roast my assumptions</strong> was uncomfortable at times, but the best ideas are never born from comfort. Mattia is a true professional.",
    "role": "Founder<span class=\"purple_highlight\"> Zeoform</span>",
    "img": {
      "src": "/images/client_alf.webp",
      "srcset": "/images/client_alf-p-500.webp 500w, /images/client_alf.webp 800w",
      "sizes": "(max-width: 479px) 100vw, 400px",
      "alt": "A man with short gray hair wearing a dark blazer and light blue shirt, smiling while sitting in front of large windows overlooking a city skyline.",
      "width": "400"
    }
  },
  "annemarie-de-graaff-pricing": {
    "imgClass": "is-anne is-price",
    "name": "Annemarie de Graaff",
    "quote": "A valuable partner for small teams and <strong>solo founders</strong> who want someone who <strong>thinks</strong> along and <strong>delivers</strong>.",
    "role": "Founder <span class=\"purple_highlight\">Genki Greens</span>",
    "img": {
      "src": "/images/client_anne.webp",
      "srcset": "/images/client_anne-p-500.webp 500w, /images/client_anne.webp 800w",
      "sizes": "(max-width: 479px) 100vw, 400px",
      "alt": "A woman with long brown hair wearing a black jacket over a white shirt, standing confidently with her arms crossed in front of a brick wall.",
      "width": "400"
    }
  },
  "rutger-zuurbier": {
    "imgClass": "is-rutger",
    "name": "Rutger Zuurbier",
    "quote": "What I really appreciate is that Mattia quickly gets to the heart of the matter and always keeps things <strong>as simple as possible</strong>.",
    "role": "Founder <span class=\"purple_highlight\">Sweep</span>",
    "img": {
      "src": "/images/client_rutger.webp",
      "alt": "A young man with curly hair smiling at the camera, wearing a white shirt, set against a blurred green outdoor background.",
      "width": "400"
    }
  },
  "sarah-wheeler-pricing": {
    "imgClass": "is-sarah",
    "name": "Sarah Wheeler",
    "quote": "Mattia <strong>listens deeply</strong>, leads meetings effectively, and delivers on time with integrity. His ability to <strong>solve problems</strong>, adapt to challenges, and keep projects aligned with brand vision has been invaluable.",
    "role": "Founder <span class=\"purple_highlight\">Puremelt Chocolate</span>",
    "img": {
      "src": "/images/client_sarah.webp",
      "alt": "A woman with long gray hair wearing a brown shirt, standing outdoors in front of green foliage, looking straight ahead with a neutral expression.",
      "width": "400"
    }
  }
};
