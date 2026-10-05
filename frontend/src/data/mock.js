// Mock data for Adurite-style marketplace clone (frontend only)
// Item thumbnails use Roblox-based asset CDN so cards look authentic.

import { thumbs } from "./thumbs";

const fallbackImg =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="%23141417"/></svg>'
  );

export const assetImg = (id) => thumbs[String(id)] || fallbackImg;
export const bundleImg = (id) => thumbs[String(id)] || fallbackImg;

export const navLinks = ["Market", "Support", "Affiliate", "Orders"];

export const markets = [
  { id: "limiteds", label: "Limiteds", active: true },
  { id: "toycodes", label: "Toy Codes", badge: "NEW" },
  { id: "cs2", label: "CS2" },
  { id: "rust", label: "Rust" },
];

export const categories = [
  { id: "all", label: "All", icon: "LayoutGrid" },
  { id: "hat", label: "Hat", icon: "HardHat" },
  { id: "gear", label: "Gear", icon: "Settings" },
  { id: "head", label: "Head", icon: "Smile" },
  { id: "face", label: "Face Accessory", icon: "Glasses" },
  { id: "back", label: "Back", icon: "Shield" },
  { id: "neck", label: "Neck", icon: "Gem" },
  { id: "hair", label: "Hair", icon: "Scissors" },
  { id: "shoulder", label: "Shoulder", icon: "Users" },
];

export const recentlySold = [
  { name: "Gold Clockwork Headphones", price: 31.8, image: assetImg(16477149823) },
  { name: "Perfectly Legitimate Business Hat", price: 20.14, image: assetImg(19027209) },
  { name: "Flaming Pink Horned Helmet", price: 23.32, image: assetImg(17756304457) },
  { name: "8-Bit Royal Crown", price: 175.48, image: assetImg(10159600649) },
  { name: "Green Queen of the Night", price: 519.52, image: assetImg(553970961) },
  { name: "Pinstripe Fedora", price: 36.46, image: assetImg(14463095) },
  { name: "Umberhorns", price: 50.5, image: assetImg(501959215) },
  { name: "Fall Fairy", price: 29.49, image: assetImg(128217885) },
];

export const giveaway = {
  name: "Super Super Happy Face",
  image: bundleImg(158380697314856),
  entries: 12033,
  endsAt: Date.now() + (1 * 86400 + 0 * 3600 + 12 * 60 + 47) * 1000,
};

const pay = ["paypal", "card", "apple"];

export const trending = [
  { id: "10159600649", name: "8-Bit Royal Crown", category: "hat", rap: "28K", price: 134, image: assetImg(10159600649), payments: pay },
  { id: "1029025", name: "The Classic Fedora", category: "hat", rap: "430K", price: 1972, image: assetImg(1029025), payments: pay },
  { id: "1365767", name: "Valkyrie Helm", category: "hat", rap: "270K", price: 1110, image: assetImg(1365767), payments: pay },
  { id: "439945661", name: "Silver King of the Night", category: "head", rap: "460K", price: 2014, image: assetImg(439945661), payments: pay },
  { id: "1744060292", name: "Poisoned Horns of the Toxic Wasteland", category: "hat", rap: "1.5M", price: 5299, image: assetImg(1744060292), payments: pay },
  { id: "553970961", name: "Green Queen of the Night", category: "head", rap: "75K", price: 403, image: assetImg(553970961), payments: pay },
  { id: "158380697314856", name: "Super Super Happy Face", category: "face", rap: "85K", price: 455, image: bundleImg(158380697314856), payments: pay },
  { id: "74891470", name: "Frozen Horns of the Frigid Planes", category: "hat", rap: "2M", price: 7350, image: assetImg(74891470), payments: pay },
  { id: "527365852", name: "Dominus Praefectus", category: "hat", rap: "860K", price: 3351, image: assetImg(527365852), payments: pay },
  { id: "215718515", name: "Fiery Horns of the Netherworld", category: "hat", rap: "2.2M", price: 7420, image: assetImg(215718515), payments: pay },
  { id: "4390891467", name: "Ice Valkyrie", category: "hat", rap: "390K", price: 1537, image: assetImg(4390891467), payments: pay },
  { id: "628771505", name: "Black Iron Horns", category: "hat", rap: "110K", price: 528, image: assetImg(628771505), payments: pay },
];

export const listings = [
  { id: "124730194", name: "Blackvalk", category: "hat", rap: "12M", price: 61480, image: assetImg(124730194) },
  { id: "215751161", name: "Orange Sparkle Time Fedora", category: "hat", rap: "9.5M", price: 45580, image: assetImg(215751161) },
  { id: "138932314", name: "Dominus Aureus", category: "hat", rap: "6M", price: 20140, image: assetImg(138932314) },
  { id: "42211680", name: "Red Domino Crown", category: "hat", rap: "5.8M", price: 19000, image: assetImg(42211680) },
  { id: "1016143686", name: "White Sparkle Time Fedora", category: "hat", rap: "5.7M", price: 20241, image: assetImg(1016143686) },
  { id: "98346834", name: "Bluesteel Fedora", category: "hat", rap: "4.8M", price: 17045, image: assetImg(98346834) },
  { id: "250395631", name: "Dominus Rex", category: "hat", rap: "4.4M", price: 25700, image: assetImg(250395631) },
  { id: "1125510", name: "The Void Star", category: "face", rap: "2.9M", price: 11500, image: assetImg(1125510) },
  { id: "183468963", name: "Ghosdeeri", category: "back", rap: "2.9M", price: 11130, image: assetImg(183468963) },
  { id: "1285307", name: "Sparkle Time Fedora", category: "hat", rap: "2.7M", price: 12499, image: assetImg(1285307) },
  { id: "286524947", name: "CW Ultimate: Wulfinite Will", category: "face", rap: "2.4M", price: 11660, image: assetImg(286524947) },
  { id: "1340199684", name: "Duke of the Fallen Federation", category: "hat", rap: "1.9M", price: 9010, image: assetImg(1340199684) },
  { id: "114385498", name: "Redspybot", category: "head", rap: "1.8M", price: 7420, image: assetImg(114385498) },
  { id: "11748356", name: "Clockwork's Shades", category: "face", rap: "1.5M", price: 5511, image: assetImg(11748356) },
  { id: "33070696", name: "Transient Harmonica", category: "gear", rap: "1.5M", price: 5419, image: assetImg(33070696) },
  { id: "173783297", name: "SFOTH IV Crown of Fire", category: "hat", rap: "1.4M", price: 8003, image: assetImg(173783297) },
  { id: "23301681", name: "Moon Seeing Stars", category: "face", rap: "1.3M", price: 3180, image: assetImg(23301681) },
  { id: "39247441", name: "Subarctic Commando", category: "head", rap: "1.2M", price: 4240, image: assetImg(39247441) },
  { id: "2015363653", name: "Old Glory Wings", category: "back", rap: "1M", price: 3551, image: assetImg(2015363653) },
  { id: "135470997", name: "Dr. Ishmael", category: "head", rap: "950K", price: 4000, image: assetImg(135470997) },
  { id: "1235488", name: "Clockwork's Headphones", category: "hair", rap: "890K", price: 3180, image: assetImg(1235488) },
  { id: "398674241", name: "GoldLika: Troll", category: "head", rap: "850K", price: 3018, image: assetImg(398674241) },
  { id: "8835828810", name: "Innovation Wings", category: "back", rap: "850K", price: 3604, image: assetImg(8835828810) },
  { id: "13370505", name: "Dark Cerulean Crown of Ozymandias", category: "hat", rap: "840K", price: 6360, image: assetImg(13370505) },
  { id: "49048671", name: "Knight of the Stygian Abyss", category: "hat", rap: "690K", price: 3074, image: assetImg(49048671) },
  { id: "14719555", name: "Robber Baron Top Hat", category: "hat", rap: "600K", price: 2968, image: assetImg(14719555) },
  { id: "553971558", name: "Pink Queen of the Night", category: "head", rap: "570K", price: 2226, image: assetImg(553971558) },
  { id: "100929295", name: "Real Ice Cold Stunnas", category: "face", rap: "560K", price: 2226, image: assetImg(100929295) },
  { id: "193696364", name: "Purple Ice Crown", category: "hat", rap: "540K", price: 2067, image: assetImg(193696364) },
  { id: "24112667", name: "Telamon's Chicken Suit", category: "back", rap: "510K", price: 1876, image: assetImg(24112667) },
  { id: "24114402", name: "Brighteyes' Cola Hat", category: "hat", rap: "480K", price: 2184, image: assetImg(24114402) },
  { id: "28676186", name: "Crimson Warlord", category: "head", rap: "450K", price: 1813, image: assetImg(28676186) },
  { id: "42846048", name: "Emo King", category: "hair", rap: "430K", price: 1731, image: assetImg(42846048) },
  { id: "51346471", name: "Twin Kodachi", category: "gear", rap: "430K", price: 1696, image: assetImg(51346471) },
  { id: "68233678", name: "Red Energy Sword", category: "gear", rap: "410K", price: 1456, image: assetImg(68233678) },
  { id: "439945864", name: "Gold King of the Night", category: "head", rap: "410K", price: 1643, image: assetImg(439945864) },
];

export const defaultPaymentMethods = [
  { id: "paypal", label: "PayPal", type: "paypal", detail: "payments@adurite-demo.com", instructions: "Send the exact total as Friends & Family, then confirm your order." },
  { id: "btc", label: "Bitcoin (BTC)", type: "crypto", detail: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", instructions: "Send the equivalent BTC amount to this address." },
  { id: "eth", label: "Ethereum (ETH)", type: "crypto", detail: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", instructions: "Send the equivalent ETH amount to this address." },
  { id: "ltc", label: "Litecoin (LTC)", type: "crypto", detail: "LQ3Qb8t6tC8hEwTbFcq9vXp5bY6Z2w9kFm", instructions: "Send the equivalent LTC amount to this address." },
];

export const allItems = [...trending, ...listings];

// --- Filter helpers (used by the sidebar) ---
export const paymentOptions = [
  { id: "all", label: "All" },
  { id: "paypal", label: "Paypal" },
  { id: "card", label: "Card" },
  { id: "apple", label: "Apple Pay" },
];

export const tagOptions = ["All", "Admin", "Particles", "Dress to Impress"];

export const sortOptions = [
  { id: "rap-high", label: "Rap (High to Low)" },
  { id: "rap-low", label: "Rap (Low to High)" },
  { id: "price-high", label: "Price (High to Low)" },
  { id: "price-low", label: "Price (Low to High)" },
  { id: "rate-low", label: "Rate (Low to High)" },
];

export const demandOptions = ["All", "Terrible", "Low", "Normal", "High", "Amazing"];
export const rarityOptions = ["All", "Common", "Uncommon", "Rare", "Epic", "Legendary"];

export const parseRap = (rap) => {
  if (!rap || rap === "\u2014") return 0;
  const m = String(rap).trim().toUpperCase();
  const num = parseFloat(m) || 0;
  if (m.endsWith("M")) return num * 1e6;
  if (m.endsWith("K")) return num * 1e3;
  return num;
};

export const getItemRarity = (item) => {
  const p = item.price;
  if (p < 100) return "Common";
  if (p < 1000) return "Uncommon";
  if (p < 5000) return "Rare";
  if (p < 20000) return "Epic";
  return "Legendary";
};

export const getItemDemand = (item) => {
  const r = parseRap(item.rap);
  if (r < 20000) return "Terrible";
  if (r < 100000) return "Low";
  if (r < 500000) return "Normal";
  if (r < 2000000) return "High";
  return "Amazing";
};

export const getItemPayments = (item) => {
  if (item.payments && item.payments.length) return item.payments;
  const p = ["paypal"];
  if (item.price <= 20000) p.push("card");
  if (item.price <= 2000) p.push("apple");
  return p;
};

export const getItemTags = (item) => {
  const tags = [];
  if (item.admin) tags.push("Admin");
  if (item.tags && item.tags.length) return [...new Set([...tags, ...item.tags])];
  if (/horn|fire|flam|frozen|ice|inferno|galaxy|star|glow|nether|toxic|blizzard|void|sparkle|periastron/i.test(item.name)) tags.push("Particles");
  if (/fedora|crown|valk|queen|king|princess|hat|fairy|wing|domino|headphone|helm|antler|shades|visor/i.test(item.name)) tags.push("Dress to Impress");
  return tags;
};
