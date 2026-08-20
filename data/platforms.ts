import type { GigPlatform, PlatformId } from "@/types/onboarding";

/**
 * `platformName` is sent verbatim as the backend's `platform_name` field —
 * keep it matching exactly what the backend expects (see the mock-gig-payout
 * contract, which shows "Swiggy" as an example).
 */
export const GIG_PLATFORMS: GigPlatform[] = [
  {
    id: "swiggy",
    platformName: "Swiggy",
    fallbackAsset: require("../assets/SWIGGY.jpeg"),
  },
  {
    id: "zomato",
    platformName: "Zomato",
    fallbackAsset: require("../assets/ZOMATO.jpeg"),
  },
  {
    id: "blinkit",
    platformName: "Blinkit",
    fallbackAsset: require("../assets/BLINKIT.jpeg"),
  },
  {
    id: "fiverr",
    platformName: "Fiverr",
    fallbackAsset: require("../assets/FIVERR.jpeg"),
  },
  {
    id: "zepto",
    platformName: "Zepto",
    fallbackAsset: require("../assets/ZEPTO.jpeg"),
  },
  {
    id: "uber",
    platformName: "Uber",
    fallbackAsset: require("../assets/UBER.jpeg"),
  },
  {
    id: "ola",
    platformName: "Ola",
    fallbackAsset: require("../assets/OLA.jpeg"),
  },
];

export interface MockPayoutItem {
  user_id: string;
  platform_name: string;
  gross_amount: number;
  platform_fee: number;
  tds_deducted: number;
  net_payout: number;
  payout_date: string;
  reference_id: string;
}

/**
 * Mock payout figures per platform.
 */
export const PLATFORM_MOCK_FINANCIALS: Record<
  string,
  MockPayoutItem[]
> = {
  swiggy: [
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "swiggy", "gross_amount": 8500.00, "platform_fee": 500.00, "tds_deducted": 85.00, "net_payout": 7915.00, "payout_date": "2026-06-01", "reference_id": "SWIGGY-2026-001"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "swiggy", "gross_amount": 8200.00, "platform_fee": 480.00, "tds_deducted": 82.00, "net_payout": 7638.00, "payout_date": "2026-06-08", "reference_id": "SWIGGY-2026-002"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "swiggy", "gross_amount": 8900.00, "platform_fee": 520.00, "tds_deducted": 89.00, "net_payout": 8291.00, "payout_date": "2026-06-15", "reference_id": "SWIGGY-2026-003"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "swiggy", "gross_amount": 7800.00, "platform_fee": 450.00, "tds_deducted": 78.00, "net_payout": 7272.00, "payout_date": "2026-06-22", "reference_id": "SWIGGY-2026-004"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "swiggy", "gross_amount": 9100.00, "platform_fee": 550.00, "tds_deducted": 91.00, "net_payout": 8459.00, "payout_date": "2026-06-29", "reference_id": "SWIGGY-2026-005"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "swiggy", "gross_amount": 8400.00, "platform_fee": 490.00, "tds_deducted": 84.00, "net_payout": 7826.00, "payout_date": "2026-07-06", "reference_id": "SWIGGY-2026-006"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "swiggy", "gross_amount": 8600.00, "platform_fee": 500.00, "tds_deducted": 86.00, "net_payout": 8014.00, "payout_date": "2026-07-13", "reference_id": "SWIGGY-2026-007"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "swiggy", "gross_amount": 8100.00, "platform_fee": 470.00, "tds_deducted": 81.00, "net_payout": 7549.00, "payout_date": "2026-07-20", "reference_id": "SWIGGY-2026-008"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "swiggy", "gross_amount": 8750.00, "platform_fee": 510.00, "tds_deducted": 87.50, "net_payout": 8152.50, "payout_date": "2026-07-27", "reference_id": "SWIGGY-2026-009"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "swiggy", "gross_amount": 8300.00, "platform_fee": 480.00, "tds_deducted": 83.00, "net_payout": 7737.00, "payout_date": "2026-08-03", "reference_id": "SWIGGY-2026-010"}
  ],
  zomato: [
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "zomato", "gross_amount": 6200.00, "platform_fee": 310.00, "tds_deducted": 62.00, "net_payout": 5828.00, "payout_date": "2026-06-03", "reference_id": "ZOMATO-2026-001"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "zomato", "gross_amount": 6500.00, "platform_fee": 330.00, "tds_deducted": 65.00, "net_payout": 6105.00, "payout_date": "2026-06-10", "reference_id": "ZOMATO-2026-002"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "zomato", "gross_amount": 5900.00, "platform_fee": 295.00, "tds_deducted": 59.00, "net_payout": 5546.00, "payout_date": "2026-06-17", "reference_id": "ZOMATO-2026-003"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "zomato", "gross_amount": 6700.00, "platform_fee": 340.00, "tds_deducted": 67.00, "net_payout": 6293.00, "payout_date": "2026-06-24", "reference_id": "ZOMATO-2026-004"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "zomato", "gross_amount": 6100.00, "platform_fee": 305.00, "tds_deducted": 61.00, "net_payout": 5734.00, "payout_date": "2026-07-01", "reference_id": "ZOMATO-2026-005"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "zomato", "gross_amount": 6400.00, "platform_fee": 320.00, "tds_deducted": 64.00, "net_payout": 6016.00, "payout_date": "2026-07-08", "reference_id": "ZOMATO-2026-006"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "zomato", "gross_amount": 6800.00, "platform_fee": 350.00, "tds_deducted": 68.00, "net_payout": 6382.00, "payout_date": "2026-07-15", "reference_id": "ZOMATO-2026-007"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "zomato", "gross_amount": 6300.00, "platform_fee": 315.00, "tds_deducted": 63.00, "net_payout": 5922.00, "payout_date": "2026-07-22", "reference_id": "ZOMATO-2026-008"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "zomato", "gross_amount": 6600.00, "platform_fee": 330.00, "tds_deducted": 66.00, "net_payout": 6204.00, "payout_date": "2026-07-29", "reference_id": "ZOMATO-2026-009"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "zomato", "gross_amount": 6150.00, "platform_fee": 305.00, "tds_deducted": 61.50, "net_payout": 5783.50, "payout_date": "2026-08-05", "reference_id": "ZOMATO-2026-010"}
  ],
  uber: [
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "uber", "gross_amount": 10000.00, "platform_fee": 800.00, "tds_deducted": 100.00, "net_payout": 9100.00, "payout_date": "2026-06-05", "reference_id": "UBER-2026-001"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "uber", "gross_amount": 9500.00, "platform_fee": 750.00, "tds_deducted": 95.00, "net_payout": 8655.00, "payout_date": "2026-06-12", "reference_id": "UBER-2026-002"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "uber", "gross_amount": 10500.00, "platform_fee": 850.00, "tds_deducted": 105.00, "net_payout": 9545.00, "payout_date": "2026-06-19", "reference_id": "UBER-2026-003"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "uber", "gross_amount": 9800.00, "platform_fee": 780.00, "tds_deducted": 98.00, "net_payout": 8922.00, "payout_date": "2026-06-26", "reference_id": "UBER-2026-004"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "uber", "gross_amount": 10200.00, "platform_fee": 810.00, "tds_deducted": 102.00, "net_payout": 9288.00, "payout_date": "2026-07-03", "reference_id": "UBER-2026-005"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "uber", "gross_amount": 9600.00, "platform_fee": 760.00, "tds_deducted": 96.00, "net_payout": 8744.00, "payout_date": "2026-07-10", "reference_id": "UBER-2026-006"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "uber", "gross_amount": 10700.00, "platform_fee": 870.00, "tds_deducted": 107.00, "net_payout": 9723.00, "payout_date": "2026-07-17", "reference_id": "UBER-2026-007"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "uber", "gross_amount": 9900.00, "platform_fee": 790.00, "tds_deducted": 99.00, "net_payout": 9011.00, "payout_date": "2026-07-24", "reference_id": "UBER-2026-008"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "uber", "gross_amount": 10400.00, "platform_fee": 830.00, "tds_deducted": 104.00, "net_payout": 9466.00, "payout_date": "2026-07-31", "reference_id": "UBER-2026-009"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "uber", "gross_amount": 9750.00, "platform_fee": 775.00, "tds_deducted": 97.50, "net_payout": 8877.50, "payout_date": "2026-08-07", "reference_id": "UBER-2026-010"}
  ],
  ola: [
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "ola", "gross_amount": 8100.00, "platform_fee": 600.00, "tds_deducted": 81.00, "net_payout": 7419.00, "payout_date": "2026-06-06", "reference_id": "OLA-2026-001"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "ola", "gross_amount": 8400.00, "platform_fee": 620.00, "tds_deducted": 84.00, "net_payout": 7696.00, "payout_date": "2026-06-13", "reference_id": "OLA-2026-002"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "ola", "gross_amount": 7900.00, "platform_fee": 580.00, "tds_deducted": 79.00, "net_payout": 7241.00, "payout_date": "2026-06-20", "reference_id": "OLA-2026-003"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "ola", "gross_amount": 8600.00, "platform_fee": 640.00, "tds_deducted": 86.00, "net_payout": 7874.00, "payout_date": "2026-06-27", "reference_id": "OLA-2026-004"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "ola", "gross_amount": 8200.00, "platform_fee": 610.00, "tds_deducted": 82.00, "net_payout": 7508.00, "payout_date": "2026-07-04", "reference_id": "OLA-2026-005"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "ola", "gross_amount": 8500.00, "platform_fee": 630.00, "tds_deducted": 85.00, "net_payout": 7785.00, "payout_date": "2026-07-11", "reference_id": "OLA-2026-006"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "ola", "gross_amount": 8800.00, "platform_fee": 650.00, "tds_deducted": 88.00, "net_payout": 8062.00, "payout_date": "2026-07-18", "reference_id": "OLA-2026-007"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "ola", "gross_amount": 8000.00, "platform_fee": 590.00, "tds_deducted": 80.00, "net_payout": 7330.00, "payout_date": "2026-07-25", "reference_id": "OLA-2026-008"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "ola", "gross_amount": 8350.00, "platform_fee": 615.00, "tds_deducted": 83.50, "net_payout": 7651.50, "payout_date": "2026-08-01", "reference_id": "OLA-2026-009"},
    {"user_id": "97fc9b68-f8b6-497f-8dc4-a6829af235f7", "platform_name": "ola", "gross_amount": 8250.00, "platform_fee": 605.00, "tds_deducted": 82.50, "net_payout": 7562.50, "payout_date": "2026-08-08", "reference_id": "OLA-2026-010"}
  ]
};
