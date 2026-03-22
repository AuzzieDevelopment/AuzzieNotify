Config = {}

-- ─── Durations (ms) ─────────────────────────────────────────────────────────────
-- Default duration per notification type. Can be overridden per-notification.
Config.Duration = {
    success = 5000,
    error   = 6000,
    warning = 5500,
    info    = 5000,
}

-- ─── Default Position ─────────────────────────────────────────────────────────
-- Fallback position used when no position is passed to the export function.
-- Each notification call can override this independently.
-- Valid values:
--   'top'          'top-left'     'top-right'
--   'bottom'       'bottom-left'  'bottom-right'
--   'left'         'right'
Config.Position = 'top-right'

-- ─── Max Visible ──────────────────────────────────────────────────────────────
-- Maximum number of toasts shown at once. Older ones are removed when exceeded.
Config.MaxNotifications = 5

-- ─── Colors ───────────────────────────────────────────────────────────────────
-- Main accent color and glow color for each notification type.
Config.Colors = {
    success = { color = '#00ff99', glow = 'rgba(0, 255, 153, 0.5)'   },
    error   = { color = '#ff4d6d', glow = 'rgba(255, 77, 109, 0.5)'  },
    warning = { color = '#ffaa00', glow = 'rgba(255, 170, 0, 0.5)'   },
    info    = { color = '#00f5ff', glow = 'rgba(0, 245, 255, 0.5)'   },
}

-- ─── Icons ────────────────────────────────────────────────────────────────────
-- Unicode / emoji icon shown on the left of each toast.
Config.Icons = {
    success = '✓',
    error   = '✕',
    warning = '⚠',
    info    = 'ℹ',
}

