import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { CategoryScore } from '../../types';

interface CategoryRadarChartProps {
  categoryScores: CategoryScore[];
  width: number;
  height: number;
}

const CategoryRadarChart: React.FC<CategoryRadarChartProps> = ({ 
  categoryScores, 
  width, 
  height 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!categoryScores.length || !svgRef.current) return;
    
    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Chart dimensions
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const radius = Math.min(chartWidth, chartHeight) / 2;
    
    // Center point
    const centerX = chartWidth / 2 + margin.left;
    const centerY = chartHeight / 2 + margin.top;
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // Categories
    const categories = categoryScores.map(d => d.category);
    const numCategories = categories.length;
    
    // Scale for the spokes (radial lines)
    const angleScale = d3.scaleLinear()
      .domain([0, numCategories])
      .range([0, 2 * Math.PI]);
    
    // Scale for the radar chart radius
    const radiusScale = d3.scaleLinear()
      .domain([0, 100]) // Assuming percentile is 0-100
      .range([0, radius]);
    
    // Draw background circles
    const ticks = [20, 40, 60, 80, 100];
    const circles = svg.append('g')
      .selectAll('circle')
      .data(ticks)
      .enter()
      .append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', d => radiusScale(d))
      .attr('fill', 'none')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1);
    
    // Draw spokes
    const spokes = svg.append('g')
      .selectAll('line')
      .data(d3.range(numCategories))
      .enter()
      .append('line')
      .attr('x1', centerX)
      .attr('y1', centerY)
      .attr('x2', (d, i) => centerX + radius * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('y2', (d, i) => centerY + radius * Math.sin(angleScale(i) - Math.PI / 2))
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 1);
    
    // Draw tick labels
    svg.append('g')
      .selectAll('text')
      .data(ticks)
      .enter()
      .append('text')
      .attr('x', centerX)
      .attr('y', d => centerY - radiusScale(d))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '8px')
      .attr('fill', '#64748b')
      .text(d => d.toString());
    
    // Draw category labels
    svg.append('g')
      .selectAll('text')
      .data(categories)
      .enter()
      .append('text')
      .attr('x', (d, i) => centerX + (radius + 15) * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('y', (d, i) => centerY + (radius + 15) * Math.sin(angleScale(i) - Math.PI / 2))
      .attr('text-anchor', (d, i) => {
        const angle = angleScale(i) - Math.PI / 2;
        if (Math.abs(angle) < 0.1 || Math.abs(angle - Math.PI) < 0.1) return 'middle';
        return angle > 0 && angle < Math.PI ? 'start' : 'end';
      })
      .attr('dominant-baseline', (d, i) => {
        const angle = angleScale(i) - Math.PI / 2;
        if (angle < -Math.PI / 2 + 0.1 || angle > Math.PI / 2 - 0.1) return 'hanging';
        if (angle > -Math.PI / 2 - 0.1 && angle < Math.PI / 2 + 0.1) return 'middle';
        return 'auto';
      })
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', '#334155')
      .text(d => d);
    
    // Generate radar path
    const radarLine = d3.lineRadial<CategoryScore>()
      .angle((d, i) => angleScale(i) - Math.PI / 2)
      .radius(d => radiusScale(d.percentile))
      .curve(d3.curveLinearClosed);
    
    // Draw radar area
    svg.append('path')
      .datum(categoryScores)
      .attr('d', radarLine as any)
      .attr('fill', 'rgba(14, 165, 233, 0.2)')
      .attr('stroke', 'rgb(14, 165, 233)')
      .attr('stroke-width', 2)
      .attr('transform', `translate(${centerX}, ${centerY})`);
    
    // Add data points
    svg.append('g')
      .selectAll('circle')
      .data(categoryScores)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => centerX + radiusScale(d.percentile) * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('cy', (d, i) => centerY + radiusScale(d.percentile) * Math.sin(angleScale(i) - Math.PI / 2))
      .attr('r', 4)
      .attr('fill', 'rgb(14, 165, 233)')
      .attr('stroke', 'white')
      .attr('stroke-width', 1);
    
    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1e293b')
      .text('Category Balance');
      
  }, [categoryScores, width, height]);
  
  return (
    <div className="flex justify-center items-center bg-white p-4 rounded-lg shadow">
      <svg ref={svgRef} />
    </div>
  );
};

export default CategoryRadarChart;