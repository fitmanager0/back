import { Injectable, Logger } from "@nestjs/common"
import { MercadoPagoConfig, Preference } from "mercadopago"
import type { PreferenceCreateData } from "mercadopago/dist/clients/preference/create/types"

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name)
  private readonly frontendURL = "http://localhost:3001/home"
  private client: MercadoPagoConfig

  constructor() {
    try {
      this.client = new MercadoPagoConfig({
        accessToken: "APP_USR-3549561525679930-012917-7126929ae757c57e1358abbcf1041373-2238960556",
      })
      this.logger.log("MercadoPago configurado exitosamente")
    } catch (error) {
      this.logger.error("Error al configurar MercadoPago:", error.message)
      throw new Error("Error al configurar MercadoPago")
    }
  }

  async createPreference(product: { title: string; price: number }) {
    this.logger.log(`Creando preferencia para producto: ${JSON.stringify(product)}`)

    const preferenceData: PreferenceCreateData = {
      body: {
        items: [
          {
            id: "1",
            title: product.title,
            unit_price: product.price,
            quantity: 1,
            currency_id: "ARS",
          },
        ],
        auto_return: "approved",
        back_urls: {
          success: `${this.frontendURL}?status=approved`,
          failure: `${this.frontendURL}?status=failure`,
          pending: `${this.frontendURL}?status=pending`,
        },
        payer: {
          email: "test_user_673315499@testuser.com",
          name: "Lalo",
          surname: "Landa",
          identification: {
            type: "DNI",
            number: "22333444",
          },
        },
        payment_methods: {
          excluded_payment_types: [{ id: "ticket" }, { id: "atm" }],
          installments: 1,
        },
        binary_mode: true,
        expires: false,
        statement_descriptor: "Tu Empresa",
        external_reference: "ORDEN_1234",
      },
    }

    try {
      const preferenceClient = new Preference(this.client)
      const response = await preferenceClient.create(preferenceData)
      this.logger.log("Preferencia creada exitosamente:", response)
      return { id: response.id, init_point: response.init_point }
    } catch (error) {
      this.logger.error("Error al crear la preferencia:", error.message)
      throw new Error(`Error al crear la preferencia: ${error.message}`)
    }
  }
}

