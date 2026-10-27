export default function LiveStatsBanner() {
  return (
    <section className="bg-neutral-900 text-white py-12 my-8 border-y border-neutral-800 font-inter">
      <div className="max-w-container-max mx-auto px-4 md:px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-center">
        {/* Stat 1 */}
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
          <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            10.000+
          </div>
          <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider mt-2">
            Mutlu Hasta &amp; Aile
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">Evde &amp; Hastanede Güvenli Bakım</p>
        </div>

        {/* Stat 2 */}
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
          <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            81 İle
          </div>
          <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider mt-2">
            Hızlı Sevkiyat
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">Ankara İçi Kata Montaj, 81 İle Ambar</p>
        </div>

        {/* Stat 3 */}
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
          <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            %100
          </div>
          <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider mt-2">
            Müşteri Memnuniyeti
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">Kesintisiz Satış Sonrası Desteği</p>
        </div>

        {/* Stat 4 */}
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-800/60 border border-neutral-700/60">
          <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            15+ Yıl
          </div>
          <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider mt-2">
            Sektörel Tecrübe
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">Medikal Ekipman Uzmanlığı</p>
        </div>
      </div>
    </section>
  );
}


