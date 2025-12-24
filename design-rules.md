# Design Rules - Veteri

Este documento contiene las reglas y principios de diseño que seguimos en el proyecto **Veteri**, basados en las Human Interface Guidelines (HIG) de Apple y mejores prácticas de diseño moderno.

## Human Interface Guidelines (HIG) de Apple

Las Human Interface Guidelines de Apple son un conjunto integral de principios y recomendaciones diseñadas para crear aplicaciones coherentes, intuitivas y atractivas. Aunque originalmente fueron creadas para las plataformas de Apple (iOS, iPadOS, macOS, watchOS, tvOS), sus principios fundamentales son aplicables a cualquier interfaz de usuario moderna.

### Principios Fundamentales

#### 1. Claridad (Clarity)

- **Definición**: La interfaz debe ser clara y legible en todos los tamaños de texto y elementos.
- **Aplicación**:
  - Usar tipografía legible y con suficiente contraste
  - Asegurar que los elementos interactivos sean claramente identificables
  - Evitar elementos decorativos que no aporten funcionalidad
  - Mantener jerarquía visual clara mediante tamaño, peso y color

#### 2. Deferencia (Deference)

- **Definición**: La interfaz debe respetar y realzar el contenido, no competir con él.
- **Aplicación**:
  - El contenido es el protagonista, la UI es el soporte
  - Usar fondos sutiles que no distraigan
  - Aplicar transparencias y efectos de manera que no opaquen el contenido
  - Minimizar elementos de UI innecesarios

#### 3. Profundidad (Depth)

- **Definición**: La jerarquía visual y el movimiento comunican jerarquía, vitalidad y facilitan la comprensión.
- **Aplicación**:
  - Usar sombras y elevación para crear jerarquía
  - Implementar transiciones y animaciones que guíen la atención
  - Aprovechar el espacio en capas (layering) para organizar información
  - Crear sensación de profundidad mediante efectos visuales sutiles

### Conceptos de Diseño Visual

#### Tipografía

- **Jerarquía clara**: Usar diferentes tamaños y pesos para establecer jerarquía
- **Legibilidad**: Asegurar contraste adecuado (mínimo 4.5:1 para texto normal, 3:1 para texto grande)
- **Espaciado**: Mantener line-height adecuado (1.4-1.6 para texto de cuerpo)
- **Consistencia**: Usar un sistema tipográfico limitado y consistente

#### Color

- **Semántica**: Usar color para comunicar significado, no solo decoración
- **Accesibilidad**: Garantizar contraste suficiente para todos los usuarios
- **Consistencia**: Mantener un sistema de colores coherente en toda la aplicación
- **Estados**: Usar color para indicar estados (hover, active, disabled, error, success)

#### Espaciado y Layout

- **Grid system**: Usar un sistema de grilla consistente para alineación
- **Espaciado consistente**: Aplicar espaciado basado en una escala (ej: 4px, 8px, 16px, 24px, 32px)
- **Márgenes y padding**: Mantener proporciones consistentes
- **Respiración**: Dar espacio suficiente a los elementos para evitar saturación visual

#### Iconografía

- **Claridad**: Iconos deben ser reconocibles y claros
- **Consistencia**: Usar un set de iconos coherente en estilo y tamaño
- **Tamaño mínimo**: Asegurar que los iconos sean lo suficientemente grandes para ser tocados/clicados (mínimo 44x44px en móvil)
- **Semántica**: Iconos deben comunicar su función claramente

### Interacciones y Animaciones

#### Feedback Visual

- **Estados claros**: Cada elemento interactivo debe tener estados visuales claros (default, hover, active, disabled)
- **Feedback inmediato**: Las acciones del usuario deben tener respuesta visual inmediata
- **Transiciones suaves**: Usar animaciones para conectar estados, no para distraer

#### Animaciones

- **Propósito**: Las animaciones deben tener un propósito (guía, feedback, orientación)
- **Duración**: Mantener animaciones cortas (200-300ms para micro-interacciones, 300-500ms para transiciones)
- **Easing**: Usar curvas de animación naturales (ease-in-out, ease-out)
- **Rendimiento**: Asegurar que las animaciones sean fluidas (60fps)

### Accesibilidad

#### Principios de Accesibilidad

- **Contraste**: Cumplir con ratios de contraste WCAG (AA mínimo, AAA preferible)
- **Tamaños táctiles**: Elementos interactivos deben tener tamaño mínimo de 44x44px
- **Navegación por teclado**: Toda funcionalidad debe ser accesible vía teclado
- **Screen readers**: Usar etiquetas semánticas y ARIA cuando sea necesario
- **Focus visible**: Indicadores de foco deben ser claros y visibles

### Liquid Glass (Nuevo Lenguaje de Diseño)

Aunque Liquid Glass fue anunciado para iOS 26 y sistemas futuros, podemos inspirarnos en sus principios:

- **Fluidez**: Interfaces que se sienten fluidas y naturales
- **Transparencia y reflexión**: Uso sutil de efectos de vidrio y reflexión
- **Profundidad dinámica**: Elementos que responden al contexto y fondo
- **Unificación**: Diseño coherente a través de diferentes tamaños de pantalla

### Referencias

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Guidelines](https://m3.material.io/) (para inspiración adicional)

---

## Próximos Pasos

Este documento se expandirá con:

- Sistema de diseño específico de Veteri
- Componentes y patrones de UI
- Guías de estilo de código
- Paleta de colores y tipografía del proyecto
- Reglas específicas de implementación
