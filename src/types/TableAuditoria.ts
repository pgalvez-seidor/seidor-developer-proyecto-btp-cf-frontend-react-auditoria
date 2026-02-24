export class ItemTableAuditoria {
  ID!: string;
  id_transaccion!: string;
  terminal!: string;
  usuario!: string;
  sistema_envio!: string;
  method_envio!: string;
  content_type!: string;
  content_length!: string;
  user_agent_envio!: string;
  aplicacion!: string;
  nombre_proceso!: string;
  fecha_transaccion!: string; // O `Date` si lo parseas
  tiempo_proceso!: number;
  entrada_proceso!: string; // JSON serializado, puede usarse como string o deserializarse
  query_proceso!: string;
  respuesta_proceso!: string; // JSON serializado
  id_estado!: number;
  createdAt!: string; // O `Date` si lo necesitas como objeto
  created_at_filtro!: string;

  constructor(init?: Partial<ItemTableAuditoria>) {
    Object.assign(this, init);
  }

  // Opcional: método para obtener entrada_proceso como objeto
  getParsedEntrada(): any {
    try {
      return JSON.parse(this.entrada_proceso);
    } catch {
      return null;
    }
  }

  // Opcional: método para obtener respuesta_proceso como objeto
  getParsedRespuesta(): any {
    try {
      return JSON.parse(this.respuesta_proceso);
    } catch {
      return null;
    }
  }
}

export class oPaginationTableAuditoria {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}
