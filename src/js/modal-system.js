// ═══════════════════════════════════════════════════════════════
// 🪟 MODAL SYSTEM - popups that demand your attention
// ═══════════════════════════════════════════════════════════════
// File Version: 0.5
// conjured by Unity AI Lab - Hackall360, Sponge, GFourteen
// ═══════════════════════════════════════════════════════════════
// centralized modal management for all those "are you sure?" moments
// because one popup is never enough apparently

const ModalSystem = {
    // 📋 Active modals registry - tracking the attention seekers
    activeModals: new Map(),
    
    // Store event listener keys for cleanup
    listeners: [],
    
    // Show a modal with the given HTML content
    showModal(html, containerId = 'game-modal-container') {
        // Create modal container if it doesn't exist
        let modalContainer = document.getElementById(containerId);
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = containerId;
            modalContainer.className = 'modal-overlay';
            document.body.appendChild(modalContainer);
        }
        
        // Store reference to this modal
        this.activeModals.set(containerId, modalContainer);
        
        // Set content and show
        modalContainer.innerHTML = html;
        modalContainer.style.display = 'flex';
        
        // Add close functionality to any close buttons
        const closeButtons = modalContainer.querySelectorAll('.close-btn, .cancel-btn');
        closeButtons.forEach(button => {
            this.listeners.push(
                EventManager.addListener(button, 'click', () => {
                    this.closeModal(containerId);
                })
            );
        });
        
        // Add click-outside-to-close functionality
        this.listeners.push(
            EventManager.addListener(modalContainer, 'click', (e) => {
                if (e.target === modalContainer) {
                    this.closeModal(containerId);
                }
            })
        );

        // Add ESC key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(containerId);
            }
        };
        this.listeners.push(
            EventManager.addListener(document, 'keydown', escHandler)
        );
        
        // Store the ESC handler for cleanup
        modalContainer.escHandler = escHandler;
        
        return modalContainer;
    },
    
    // Close a specific modal
    closeModal(containerId) {
        const modalContainer = this.activeModals.get(containerId);
        if (modalContainer) {
            // Remove all event listeners associated with this modal
            this.listeners = this.listeners.filter(key => {
                const listener = EventManager.listeners.get(key);
                if (listener && listener.element === modalContainer) {
                    EventManager.removeListener(key);
                    return false;
                }
                return true;
            });
            
            // Hide and clear modal
            modalContainer.style.display = 'none';
            modalContainer.innerHTML = '';
            
            // Remove from active modals
            this.activeModals.delete(containerId);
        }
    },
    
    // Close all active modals
    closeAllModals() {
        // Clear all modal listeners
        this.listeners.forEach(key => EventManager.removeListener(key));
        this.listeners = [];
        
        for (const [containerId] of this.activeModals) {
            const modalContainer = this.activeModals.get(containerId);
            if (modalContainer) {
                // Hide and clear modal
                modalContainer.style.display = 'none';
                modalContainer.innerHTML = '';
            }
        }
        
        // Clear all active modals
        this.activeModals.clear();
    },
    
    // Check if a modal is currently active
    isModalActive(containerId) {
        return this.activeModals.has(containerId);
    },
    
    // Get the number of active modals
    getActiveModalCount() {
        return this.activeModals.size;
    },
    
    // Initialize modal system
    init() {
        // Add global styles for modals if not already present
        if (!document.getElementById('modal-system-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-system-styles';
            style.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    padding: 20px;
                    box-sizing: border-box;
                }
                
                .modal-overlay > div {
                    background: linear-gradient(135deg, #2a1810 0%, #1a0f08 100%);
                    border: 2px solid #8b4513;
                    border-radius: 8px;
                    max-width: 90%;
                    max-height: 90%;
                    overflow-y: auto;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                    position: relative;
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    border-bottom: 1px solid #8b4513;
                    background: linear-gradient(90deg, #8b4513 0%, #a0522d 100%);
                    color: #f4e4c1;
                }
                
                .modal-header h2 {
                    margin: 0;
                    font-size: 1.5em;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }
                
                .modal-content {
                    padding: 20px;
                    color: #f4e4c1;
                }
                
                .modal-footer {
                    padding: 15px 20px;
                    border-top: 1px solid #8b4513;
                    background: rgba(139, 69, 19, 0.2);
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                
                .close-btn, .cancel-btn {
                    background: #8b4513;
                    color: #f4e4c1;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1.2em;
                    transition: background-color 0.3s;
                }
                
                .close-btn:hover, .cancel-btn:hover {
                    background: #a0522d;
                }
                
                .primary-btn, .secondary-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s;
                }
                
                .primary-btn {
                    background: linear-gradient(135deg, #8b4513 0%, #a0522d 100%);
                    color: #f4e4c1;
                }
                
                .primary-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, #a0522d 0%, #cd853f 100%);
                }
                
                .secondary-btn {
                    background: #654321;
                    color: #f4e4c1;
                }
                
                .secondary-btn:hover:not(:disabled) {
                    background: #8b4513;
                }
                
                .primary-btn:disabled, .secondary-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `;
            document.head.appendChild(style);
        }
        
        this.unloadListener = EventManager.addListener(window, 'beforeunload', () => {
            this.closeAllModals();
        });
    }
};

// Auto-initialize when script loads
ModalSystem.init();