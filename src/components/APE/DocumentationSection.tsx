"use client";

import React from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface DocumentCard {
  id: string;
  title: string;
  subtitle: string;
  previewImage: string;
  downloadUrl: string;
}

const documents: DocumentCard[] = [
  {
    id: "depliant",
    title: "DÉPLIANT",
    subtitle: "Le dépliant de l'opération",
    previewImage: "/documentation_operationnelle/visuel-ape-support.png",
    downloadUrl: "/documentation_operationnelle/depliant_1.pdf",
  },
  {
    id: "note_info",
    title: "NOTE D'INFORMATION",
    subtitle: "La note d'information",
    previewImage: "/documentation_operationnelle/visuel-ape-support.png",
    downloadUrl: "/documentation_operationnelle/note_info.pdf",
  },
  {
    id: "bulletin",
    title: "BULLETIN DE SOUSCRIPTION",
    subtitle: "Le bulletin de souscription",
    previewImage: "/documentation_operationnelle/bulletin-ape-support.png",
    downloadUrl: "/documentation_operationnelle/bulletin.pdf",
  },
];

export default function DocumentationSection() {
  const handleDownload = (downloadUrl: string, title: string) => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = title.toLowerCase().replace(/\s+/g, "_") + ".pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-16 sm:py-20 bg-white" aria-label="Documentation opérationnelle">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="sama-heading-section mb-4">
            Documentation de l'opération à télécharger
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleDownload(doc.downloadUrl, doc.title)}
              className="group cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2"
            >
              {/* Preview Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={doc.previewImage}
                  alt={`Aperçu ${doc.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzXb+oXNhqMN1bSFJYmDKR9BrQ7TfN7cWkMrRQBnQMQB0CRSlKVlxjqxBPZ//2Q=="
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>

              {/* Card Content */}
              <div className="p-6 text-center border-t border-gray-100">
                <h3 className="font-bold text-lg text-[#435933] mb-1 tracking-wide">
                  {doc.title}
                </h3>
                <p className="text-sm text-gray-500">{doc.subtitle}</p>
                
                {/* Download indicator */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sama-accent-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Télécharger</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
