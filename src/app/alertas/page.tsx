"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AlertasHeader from '../../components/ui/AlertasHeader';
import AlertasList, { ProductoAlerta } from '../../components/ui/AlertasList';

export default function AlertasPage() {
  const [productos, setProductos] = useState<ProductoAlerta[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarAlertas = async () => {
      setCargando(true);
      try {
        // Traemos las piezas para evaluar su stock localmente
        const { data, error } = await supabase
          .from('productos')
          .select('id, no_parte, nombre, stock, minimo');
          
        if (error) throw error;
        
        if (data) {
          setProductos(data);
        }
      } catch (error) {
        console.error("Error al cargar alertas:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarAlertas();
  }, []);

  // Calculamos el total de alertas para pasarlo a la cabecera
  const totalAlertas = productos.filter(p => p.stock <= p.minimo).length;

  return (
    <div className="flex flex-col gap-6 h-full">
      <AlertasHeader totalAlertas={totalAlertas} />
      <AlertasList productos={productos} cargando={cargando} />
    </div>
  );
}