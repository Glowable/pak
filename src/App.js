import React, { useState } from 'react'
import './App.css'
const { ipcRenderer } = window.require('electron')
const fs = window.require('fs')
const path = window.require('path')

function App() {
    const [gamePath, setGamePath] = useState('')
    const [fortnitePathExists, setFortnitePathExists] = useState(false)

    const handleGamePathClick = async () => {
        const result = await ipcRenderer.invoke('open-file-dialog')
        if (result && result.length > 0) {
            setGamePath(result[0])

            // Check if 'FortniteGame\Content\Paks' exists within the selected directory
            const fortnitePath = path.join(result[0], 'FortniteGame', 'Content', 'Paks')
            const exists = await ipcRenderer.invoke('does-path-exist', fortnitePath)
            setFortnitePathExists(exists)
        }
    }

    const handleDownloadClick = async () => {
        if (gamePath) {
            const fortnitePath = path.join(gamePath, 'FortniteGame', 'Content', 'Paks')
            const url = 'https://dev.glowable.net/z_Test.pak' // URL of the PAK file
            const destination = path.join(fortnitePath, 'z_Test.pak') // Destination in the Fortnite directory

            await ipcRenderer.invoke('download-file', url, destination)
        }
    }



    return (
        <div className="App">
            <div className="app-content">
                <h1>Fortnite PAK Files Manager</h1>
                <div className="input-group">
                    <label>Selected Game Path:</label>
                    <p>{gamePath}</p>
                </div>
                <button className="btn" onClick={handleGamePathClick}>
                    Select Game Path
                </button>
                <div className="input-group">
                    <label>Fortnite path exists:</label>
                    <p>{fortnitePathExists ? 'Yes' : 'No'}</p>
                </div>
                {fortnitePathExists && 
                    <button className="btn" onClick={handleDownloadClick}>
                        Download and Install PAK File
                    </button>
                }
            </div>
        </div>
    )
}

export default App
