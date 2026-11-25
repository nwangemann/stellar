/** Latin genitives by constellation id, as in "Alpha Centauri". */
export const GENITIVES: Readonly<Record<string, string>> = Object.fromEntries(
  `And Andromedae,Ant Antliae,Aps Apodis,Aqr Aquarii,Aql Aquilae,Ara Arae,Ari Arietis,Aur Aurigae,
Boo Bootis,Cae Caeli,Cam Camelopardalis,Cnc Cancri,CVn Canum Venaticorum,CMa Canis Majoris,
CMi Canis Minoris,Cap Capricorni,Car Carinae,Cas Cassiopeiae,Cen Centauri,Cep Cephei,Cet Ceti,
Cha Chamaeleontis,Cir Circini,Col Columbae,Com Comae Berenices,CrA Coronae Australis,
CrB Coronae Borealis,Crv Corvi,Crt Crateris,Cru Crucis,Cyg Cygni,Del Delphini,Dor Doradus,
Dra Draconis,Equ Equulei,Eri Eridani,For Fornacis,Gem Geminorum,Gru Gruis,Her Herculis,
Hor Horologii,Hya Hydrae,Hyi Hydri,Ind Indi,Lac Lacertae,Leo Leonis,LMi Leonis Minoris,Lep Leporis,
Lib Librae,Lup Lupi,Lyn Lyncis,Lyr Lyrae,Men Mensae,Mic Microscopii,Mon Monocerotis,Mus Muscae,
Nor Normae,Oct Octantis,Oph Ophiuchi,Ori Orionis,Pav Pavonis,Peg Pegasi,Per Persei,Phe Phoenicis,
Pic Pictoris,Psc Piscium,PsA Piscis Austrini,Pup Puppis,Pyx Pyxidis,Ret Reticuli,Sge Sagittae,
Sgr Sagittarii,Sco Scorpii,Scl Sculptoris,Sct Scuti,Ser Serpentis,Sex Sextantis,Tau Tauri,
Tel Telescopii,Tri Trianguli,TrA Trianguli Australis,Tuc Tucanae,UMa Ursae Majoris,
UMi Ursae Minoris,Vel Velorum,Vir Virginis,Vol Volantis,Vul Vulpeculae`
    .split(/,\s*/)
    .map((entry) => [entry.slice(0, 3), entry.slice(4)]),
);
