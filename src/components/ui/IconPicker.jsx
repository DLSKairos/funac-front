import { useState, useEffect, useRef } from 'react'
import {
  Heart, Shield, Star, Users, Target, Eye, Lightbulb, Leaf,
  CheckCircle, Award, Globe, Home, Book, Briefcase, Building,
  Camera, Clock, Cloud, Code, Coffee, Compass, Database,
  Flag, Gift, HeartHandshake, Headphones, Info, Key,
  Layers, Link, Lock, Mail, Map, MessageCircle, Music,
  Phone, PieChart, Rocket, Search, Settings, Share2, Smile,
  Sun, ThumbsUp, TreePine, TrendingUp, Trophy, Truck,
  Umbrella, Zap, ArrowRight, Bell, Calendar, Cpu, Download,
} from 'lucide-react'

const ICON_MAP = {
  Heart, Shield, Star, Users, Target, Eye, Lightbulb, Leaf,
  CheckCircle, Award, Globe, Home, Book, Briefcase, Building,
  Camera, Clock, Cloud, Code, Coffee, Compass, Database,
  Flag, Gift, HeartHandshake, Headphones, Info, Key,
  Layers, Link, Lock, Mail, Map, MessageCircle, Music,
  Phone, PieChart, Rocket, Search, Settings, Share2, Smile,
  Sun, ThumbsUp, TreePine, TrendingUp, Trophy, Truck,
  Umbrella, Zap, ArrowRight, Bell, Calendar, Cpu, Download,
}

const ICON_NAMES = Object.keys(ICON_MAP)

export default function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const SelectedIcon = (value && ICON_MAP[value]) ? ICON_MAP[value] : Smile

  const handleSelect = (name) => {
    if (name === value) {
      onChange(null)
    } else {
      onChange(name)
    }
    setOpen(false)
  }

  const handleClear = () => {
    onChange(null)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:border-funac-navy transition-colors text-sm text-gray-600"
        title={value ? `Icono: ${value}` : 'Sin icono seleccionado'}
      >
        <SelectedIcon size={16} className={value ? 'text-funac-orange' : 'text-gray-400'} />
        <span>{value || 'Cambiar icono'}</span>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-3 w-80"
          role="dialog"
          aria-label="Selector de iconos"
        >
          <p className="text-xs text-gray-500 font-medium mb-2">Selecciona un icono</p>
          <div className="grid grid-cols-8 gap-1">
            {ICON_NAMES.map((name) => {
              const Icon = ICON_MAP[name]
              const isSelected = value === name
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => handleSelect(name)}
                  className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-funac-orange text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                </button>
              )
            })}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sin icono
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
