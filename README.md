# Compras ERP - Dashboard Prototype

## 🏢 Descripción del Proyecto

**Compras ERP** es un prototipo de dashboard empresarial para un sistema de compras y procurement corporativo. Diseñado con una estética moderna y corporativa inspirada en Promart, proporciona una interfaz intuitiva para la gestión de compras, proveedores e inventario.

## ✨ Características Principales

### Dashboard Interactivo
- **KPIs en tiempo real** con tendencias y mini-gráficos
- **Filtros temporales** (Semana/Mes/Trimestre) con actualización dinámica
- **Alternador de divisa** (Soles/USD) con conversión automática
- **Gráficos de tendencia** con comparación vs período anterior
- **Actividad reciente** con timeline de eventos
- **Alertas de stock bajo** con niveles de urgencia
- **Acciones rápidas** con feedback visual

### Navegación y Layout
- **Sidebar colapsible** con iconografía clara
- **Header corporativo** con perfil de usuario
- **Responsive design** optimizado para desktop
- **Micro-animaciones** sutiles para mejor UX

### Datos Mock Realistas
- **Proveedores peruanos** con nombres corporativos
- **Montos en Soles (PEN)** con conversión a USD
- **Fechas y estados** realistas para órdenes de compra
- **Inventario corporativo** con umbrales de stock

## 🎨 Diseño y Branding

### Paleta de Colores
- **Naranja Principal**: `#FF6F00` - Color corporativo principal
- **Gris Oscuro**: `#2E2E2E` - Textos y elementos principales
- **Fondo**: `#F5F5F5` - Fondo general de la aplicación
- **Éxito**: `#2E7D32` - Estados positivos y confirmaciones
- **Alerta**: `#E53935` - Alertas y estados críticos

### Tipografía
- **Inter** - Fuente principal para máxima legibilidad corporativa

## 🛠️ Tecnologías Utilizadas

- **React 18** con TypeScript para type safety
- **Vite** para desarrollo rápido y build optimizado
- **Tailwind CSS** para styling eficiente y responsive
- **Lucide React** para iconografía consistente
- **Recharts** para visualizaciones de datos
- **date-fns** para manejo de fechas en español

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js 16+ 
- npm o yarn

### Instalación
```bash
# Clonar o descargar el proyecto
cd "Integrador ERP"

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linting del código
```

## 📱 Funcionalidades Interactivas

### KPIs Dinámicos
- **Total de proveedores**: Actualiza según el período seleccionado
- **Órdenes pendientes**: Requieren aprobación con indicadores visuales
- **Alertas de stock**: Productos bajo umbral mínimo
- **Gasto del período**: Con mini-gráfico de tendencia integrado

### Filtros Temporales
- **Semana**: Vista de 7 días con datos diarios
- **Mes**: Vista mensual con datos semanales
- **Trimestre**: Vista trimestral con datos mensuales

### Conversión de Divisas
- **PEN (Soles)**: Moneda base del sistema
- **USD (Dólares)**: Conversión automática con tipo de cambio fijo (3.75)

### Acciones Rápidas
- **Crear Orden de Compra**: Simula creación con loader y toast
- **Agregar Proveedor**: Acción de registro con feedback
- **Ver Reporte de Inventario**: Navegación simulada a reportes

## 📊 Estructura de Datos

### Órdenes de Compra
```typescript
interface Order {
  id: string;           // Formato: OC-2024-001
  supplier: string;     // Nombre del proveedor
  date: string;         // Fecha ISO
  status: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'En Proceso';
  amount: number;       // Monto en PEN
  currency: 'PEN' | 'USD';
}
```

### Alertas de Stock
```typescript
interface StockItem {
  id: string;
  name: string;         // Nombre del producto
  currentStock: number; // Stock actual
  minStock: number;     // Umbral mínimo
  unit: string;         // Unidad de medida
  category: string;     // Categoría del producto
}
```

## 🎯 Casos de Uso Principales

### Administrador de Compras
- Monitor KPIs de performance de compras
- Revisar y aprobar órdenes pendientes
- Gestionar alertas de stock crítico
- Analizar tendencias de gasto

### Gerente de Procurement
- Vista ejecutiva de métricas corporativas
- Análisis comparativo de períodos
- Supervisión de actividad del equipo
- Control presupuestario en múltiples divisas

### Analista de Inventario
- Monitoreo de niveles de stock
- Identificación de productos críticos
- Seguimiento de movimientos de inventario
- Generación de reportes de reposición

## 🔧 Configuración y Personalización

### Tipo de Cambio
El tipo de cambio PEN/USD está configurado en `src/data/mockData.ts`:
```typescript
export const EXCHANGE_RATE = 3.75; // Modificable según necesidad
```

### Datos Mock
Los datos de ejemplo se encuentran en `src/data/mockData.ts` y pueden ser reemplazados por APIs reales:
- `mockOrders`: Órdenes de compra
- `mockActivities`: Actividad reciente
- `mockLowStock`: Productos con stock bajo
- `mockKPIData`: Métricas por período

## 📈 Métricas y KPIs

### Período Semanal
- Proveedores activos: 245 (+2.5%)
- Órdenes pendientes: 8 (-12.5%)
- Alertas stock: 5 (+8.3%)
- Gasto: S/156,430 (+15.2%)

### Período Mensual
- Proveedores activos: 312 (+8.2%)
- Órdenes pendientes: 23 (-12.5%)
- Alertas stock: 12 (+8.3%)
- Gasto: S/487,250 (+15.2%)

### Período Trimestral
- Proveedores activos: 387 (+15.7%)
- Órdenes pendientes: 67 (-12.5%)
- Alertas stock: 28 (+8.3%)
- Gasto: S/1,425,680 (+15.2%)

## 🔒 Accesibilidad y UX

### Estándares Implementados
- **Focus visible** en todos los elementos interactivos
- **ARIA labels** para lectores de pantalla
- **Contraste de colores** WCAG AA compliant
- **Navegación por teclado** completamente funcional

### Responsive Design
- **Desktop first** con breakpoints móviles
- **Grid adaptativo** para diferentes resoluciones
- **Sidebar colapsible** para pantallas reducidas
- **Componentes flexibles** que se adaptan al contenido

## 🚀 Próximos Pasos (Roadmap)

### Funcionalidades Futuras
- [ ] Autenticación y autorización
- [ ] Integración con APIs backend
- [ ] Modo oscuro/claro
- [ ] Exportación de reportes (PDF/Excel)
- [ ] Notificaciones push en tiempo real
- [ ] Dashboard personalizable
- [ ] Filtros avanzados y búsqueda
- [ ] Multi-idioma (español/inglés)

### Integraciones Planificadas
- [ ] ERP systems (SAP, Oracle)
- [ ] E-procurement platforms
- [ ] Sistemas de aprobación workflow
- [ ] APIs de proveedores
- [ ] Sistemas de inventario WMS

## 📝 Notas de Desarrollo

### Estructura del Proyecto
```
src/
├── components/           # Componentes React
│   ├── dashboard/       # Componentes específicos del dashboard
│   ├── Layout.tsx       # Layout principal
│   ├── Header.tsx       # Header corporativo
│   └── Sidebar.tsx      # Navegación lateral
├── data/                # Datos mock y configuración
├── types/               # Definiciones TypeScript
└── styles/              # Estilos globales
```

### Consideraciones de Performance
- **Bundle size**: ~585KB (compresión gzip: ~168KB)
- **Lazy loading** implementable para componentes pesados
- **Memoización** en componentes de gráficos
- **Virtual scrolling** recomendado para listas largas

## 🎉 Demo y Características Destacadas

El prototipo incluye:
✅ **Interacciones micro** con feedback visual
✅ **Datos realistas** en español para mercado peruano
✅ **Animaciones sutiles** tipo enterprise
✅ **Toast notifications** para acciones del usuario
✅ **Estados de carga** en acciones asíncronas
✅ **Responsive design** desktop-first
✅ **Paleta corporativa** profesional
✅ **Tipografía empresarial** legible
✅ **Componentes reutilizables** modulares

---

**Desarrollado con ❤️ para el ecosistema empresarial peruano**

*Este es un prototipo funcional diseñado para demostrar capacidades de desarrollo frontend enterprise con tecnologías modernas.*