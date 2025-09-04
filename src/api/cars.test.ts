import { describe, it, expect, vi, afterEach } from 'vitest'
import { getCars } from './cars'

afterEach(() => {
  vi.restoreAllMocks()
})

function mockFetchWithPayload(payload: unknown) {
  const mock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => payload,
  })
  vi.stubGlobal('fetch', mock)
  return mock
}

describe('getCars normalization', () => {
  it('normalizes available cars, legend and sorting (object root)', async () => {
    const root = {
      VehAvailRSCore: {
        VehRentalCore: {
          '@PickUpDateTime': '2023-01-01T10:00:00Z',
          '@ReturnDateTime': '2023-01-03T10:00:00Z',
          PickUpLocation: { '@Name': 'Airport A' },
          ReturnLocation: { '@Name': 'Airport B' },
        },
        VehVendorAvails: [
          {
            Vendor: { '@Code': 'VND1', '@Name': 'Vendor One' },
            VehAvails: [
              {
                '@Status': 'Available',
                Vehicle: {
                  '@Code': 'C1',
                  VehMakeModel: { '@Name': 'Car One' },
                  PictureURL: 'http://img/1.jpg',
                  '@PassengerQuantity': '4',
                  '@BaggageQuantity': '2',
                  '@TransmissionType': 'Automatic',
                  '@AirConditionInd': 'Yes',
                  '@FuelType': 'Petrol',
                  '@DoorCount': '4',
                },
                TotalCharge: {
                  '@CurrencyCode': 'EUR',
                  '@EstimatedTotalAmount': 100,
                },
              },
              {
                '@Status': 'NotAvailable',
                Vehicle: {
                  '@Code': 'NA',
                  VehMakeModel: { '@Name': 'Skip Me' },
                },
                TotalCharge: { '@CurrencyCode': 'EUR', '@EstimatedTotalAmount': 999 },
              },
            ],
          },
          {
            Vendor: { '@Code': 'VND2', '@Name': 'Vendor Two' },
            VehAvails: [
              {
                '@Status': 'Available',
                Vehicle: {
                  '@Code': 'C2',
                  VehMakeModel: { '@Name': 'Car Two' },
                  PictureURL: 'http://img/2.jpg',
                  '@PassengerQuantity': '5',
                  '@BaggageQuantity': '3',
                  '@TransmissionType': 'Manual',
                  '@AirConditionInd': 'No',
                  '@FuelType': 'Diesel',
                  '@DoorCount': '5',
                },
                TotalCharge: {
                  '@CurrencyCode': 'EUR',
                  '@RateTotalAmount': '50',
                },
              },
              {
                '@Status': 'Available',
                Vehicle: {
                  '@Code': 'C3',
                  VehMakeModel: { '@Name': 'Car Three' },
                  PictureURL: 'http://img/3.jpg',
                  '@PassengerQuantity': '2',
                  '@BaggageQuantity': '1',
                  '@TransmissionType': 'Auto',
                  '@AirConditionInd': 'Yes',
                  '@FuelType': 'Electric',
                  '@DoorCount': '3',
                },
                TotalCharge: {
                  '@CurrencyCode': 'EUR',
                  '@EstimatedTotalAmount': null,
                  '@RateTotalAmount': null,
                },
              },
            ],
          },
        ],
      },
    }

    mockFetchWithPayload(root)
    const data = await getCars('mock-url')

    expect(data.legend).toEqual({
      pickupName: 'Airport A',
      pickupAt: '2023-01-01T10:00:00Z',
      returnName: 'Airport B',
      returnAt: '2023-01-03T10:00:00Z',
    })

    expect(data.cars).toHaveLength(3)
    expect(data.cars.map((c) => c.id)).toEqual([
      'VND2-C3-1',
      'VND2-C2-0',
      'VND1-C1-0',
    ])

    const [c0, c1, c2] = data.cars
    expect(c0.price).toBe(0)
    expect(c0.pricePerDay).toBe(0)
    expect(c0.currency).toBe('EUR')
    expect(c0.vendorName).toBe('Vendor Two')

    expect(c1.price).toBe(50)
    expect(c1.pricePerDay).toBe(25)
    expect(c1.name).toBe('Car Two')

    expect(c2.price).toBe(100)
    expect(c2.pricePerDay).toBe(50)
    expect(c2.name).toBe('Car One')
  })

  it('falls back to 1 rental day when dates are invalid (array root)', async () => {
    const arrayRoot = [
      {
        VehAvailRSCore: {
          VehRentalCore: {
            '@PickUpDateTime': '',
            '@ReturnDateTime': '',
            PickUpLocation: { '@Name': '' },
            ReturnLocation: { '@Name': '' },
          },
          VehVendorAvails: [
            {
              Vendor: { '@Code': 'V', '@Name': 'Vendor' },
              VehAvails: [
                {
                  '@Status': 'Available',
                  Vehicle: {
                    '@Code': 'X',
                    VehMakeModel: { '@Name': 'Model X' },
                  },
                  TotalCharge: {
                    '@CurrencyCode': 'USD',
                    '@EstimatedTotalAmount': 90,
                  },
                },
              ],
            },
          ],
        },
      },
    ]

    mockFetchWithPayload(arrayRoot)
    const data = await getCars('mock-url')

    expect(data.legend.pickupAt).toBe('')
    expect(data.legend.returnAt).toBe('')
    expect(data.cars).toHaveLength(1)
    expect(data.cars[0].price).toBe(90)
    expect(data.cars[0].pricePerDay).toBe(90)
  })
})
