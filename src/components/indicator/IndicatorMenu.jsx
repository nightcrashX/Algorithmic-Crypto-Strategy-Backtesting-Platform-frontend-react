import React, { useState } from 'react';
import useIndicatorStore from '../../store/indicatorStore';
import { updateIndicatorConfig } from '../../services/indicatorService';

const IndicatorMenu = ({ indicator, currentMarket, onClose }) => {
  // 1. Store numeric/text settings from the indicator
  const [settings, setSettings] = useState(indicator.settings || {});
  
  // 2. NEW: Dedicated state for tracking the indicator line color
  // Checks indicator.style.color or indicator.settings.color first, falls back to blue
  const [lineColor, setLineColor] = useState(
    indicator.style?.color || indicator.settings?.color || '#e3e6ec'
  );

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: typeof value === 'string' && !isNaN(value) && value !== '' ? Number(value) : value
    }));
  };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const allCurrentIndicators = useIndicatorStore.getState().indicators;

      // 1. Separate math inputs from UI styles so the backend doesn't crash!
      // This keeps keys like 'period' inside mathSettings, and ignores 'color'
      const { color: dummy, ...mathSettings } = settings; 

      const formattedIndicatorsList = allCurrentIndicators.map((ind) => {
        if (ind.id === indicator.id) {
          return {
            id: ind.id,
            type: ind.type,
            settings: mathSettings // Send ONLY math parameters (like period) to FastAPI
          };
        }
        return {
          id: ind.id,
          type: ind.type,
          settings: ind.settings || {}
        };
      });

      const body = {
        exchange: currentMarket.exchange,     
        symbol: currentMarket.symbol,         
        timeframe: currentMarket.timeframe,   
        indicators: formattedIndicatorsList   
      };

      try {
        const responseData = await updateIndicatorConfig(body);

        let dynamicServerMatch = null;
        if (Array.isArray(responseData)) {
          dynamicServerMatch = responseData.find(item => item.id === indicator.id) || responseData;
        } else {
          dynamicServerMatch = responseData;
        }

        if (dynamicServerMatch) {
          //    Save to Zustand, putting the color into BOTH locations safely
          useIndicatorStore.getState().updateIndicator(indicator.id, {
            ...dynamicServerMatch,
            id: indicator.id, 
            settings: {
              ...mathSettings,
              color: lineColor // Save here so settings panel remembers it next time
            },
            style: {
              ...indicator.style,
              color: lineColor // Save here so ChartCanvas.jsx reads it to draw the line
            }
          });
        }

        onClose();
      } catch (error) {
        console.error("Layout setting dispatch sequence failure:", error);
      }
    };

  return (
    <div className="settings-modal-overlay" style={{
      position: 'absolute', top: '20%', left: '35%', backgroundColor: '#1e222d', 
      color: '#fff', padding: '20px', borderRadius: '8px', zIndex: 999, border: '1px solid #363c4e'
    }}>
      <h3>Modify {indicator.type} Settings</h3>
      <form onSubmit={handleSubmit}>
        
        {/* Render all structural numerical parameters like period, source, etc. */}
        {Object.keys(settings).map((key) => {
          // Skip drawing color here if it accidentally exists in settings to avoid double input fields
          if (key === 'color') return null; 

          return (
            <div key={key} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center' }}>
              <label style={{ textTransform: 'capitalize' }}>{key.replace('_', ' ')}:</label>
              {typeof settings[key] === 'number' ? (
                <input 
                  type="number" 
                  value={settings[key]} 
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  style={{ backgroundColor: '#2a2e39', color: '#fff', border: '1px solid #434651', borderRadius: '4px', padding: '4px', width: '80px' }}
                />
              ) : (
                <input 
                  type="text" 
                  value={settings[key]} 
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  style={{ backgroundColor: '#2a2e39', color: '#fff', border: '1px solid #434651', borderRadius: '4px', padding: '4px', width: '80px' }}
                />
              )}
            </div>
          );
        })}

        {/*   NEW: Permanent Dedicated Color Picker Form Field */}
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center' }}>
          <label>Line Color:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="color" 
              value={lineColor} 
              onChange={(e) => setLineColor(e.target.value)}
              style={{ backgroundColor: 'transparent', border: 'none', width: '40px', height: '30px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '12px', color: '#aaa', fontFamily: 'monospace' }}>{lineColor.toUpperCase()}</span>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" onClick={onClose} style={{ background: 'none', color: '#aaa', border: 'none', cursor: 'pointer' }}>Cancel</button>
          <button type="submit" style={{ backgroundColor: '#2962ff', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Apply Settings</button>
        </div>
      </form>
    </div>
  );
};

export default IndicatorMenu;
