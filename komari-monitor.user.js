// ==UserScript==
// @name         MJJBOX论坛Komari探针分享
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  在MJJBOX论坛用户名旁显示Komari探针总体统计信息
// @author       You
// @match        https://mjjbox.com/*
// @match        https://www.mjjbox.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    
    // ========== 配置参数 ==========
    // 公共分享API服务器配置
    const PUBLIC_API_SERVER = 'https://api.sharon.ee'; // 这里千万不要动
    
    // ========== 脚本开始 ==========

    // 添加现代化样式
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .komari-probe-btn {
            display: inline-block;
            margin-left: 8px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
            color: white !important;
            border: none;
            border-radius: 20px;
            padding: 6px 14px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            text-decoration: none !important;
            vertical-align: middle;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
            backdrop-filter: blur(10px);
        }
        
        .komari-probe-btn:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
            color: white !important;
            text-decoration: none !important;
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
        }
        
        .komari-config-btn {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(20px);
            font-family: 'Inter', sans-serif;
        }
        
        .komari-config-btn:hover {
            transform: scale(1.1) rotate(90deg);
            box-shadow: 0 12px 40px rgba(99, 102, 241, 0.5);
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
        }
        
        .komari-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(8px);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: komari-fade-in 0.3s ease-out;
        }
        
        @keyframes komari-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes komari-slide-up {
            from { 
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .komari-modal-content {
            background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
            padding: 32px;
            border-radius: 24px;
            width: 90%;
            max-width: 520px;
            max-height: 85vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: komari-slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .komari-modal-header {
            margin-bottom: 24px;
            padding-bottom: 20px;
            padding-right: 60px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .komari-modal-title {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0;
            font-family: 'Inter', sans-serif;
        }
        
        .komari-close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            font-size: 18px;
            cursor: pointer;
            color: #64748b;
            padding: 0;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 600;
            z-index: 10;
        }
        
        .komari-close-btn:hover {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        
        .komari-config-section {
            margin-bottom: 28px;
            padding: 24px;
            background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
            position: relative;
            overflow: hidden;
        }
        
        .komari-config-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        }
        
        .komari-config-section h3 {
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            color: #1e293b;
            font-size: 18px;
        }
        
        .komari-input-group {
            margin-bottom: 20px;
        }
        
        .komari-input {
            width: 100%;
            padding: 16px 20px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 15px;
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-sizing: border-box;
            background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
            color: #1e293b;
        }
        
        .komari-input:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1), 0 4px 16px rgba(99, 102, 241, 0.1);
            background: #ffffff;
            transform: translateY(-1px);
        }
        
        .komari-input::placeholder {
            color: #94a3b8;
            font-weight: 400;
        }
        
        .komari-btn {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            border: none;
            padding: 14px 28px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
            margin-right: 12px;
            margin-bottom: 8px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);
            position: relative;
            overflow: hidden;
        }
        
        .komari-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }
        
        .komari-btn:hover::before {
            left: 100%;
        }
        
        .komari-btn:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
        }
        
        .komari-btn-secondary {
            background: linear-gradient(135deg, #64748b 0%, #475569 100%);
            box-shadow: 0 4px 16px rgba(100, 116, 139, 0.2);
        }
        
        .komari-btn-secondary:hover {
            background: linear-gradient(135deg, #475569 0%, #334155 100%);
            box-shadow: 0 8px 25px rgba(100, 116, 139, 0.3);
        }
        
        .komari-stats-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(12px);
            z-index: 10002;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: komari-fade-in 0.3s ease-out;
        }
        
        .komari-stats-content {
            background: linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #334155 100%);
            color: white;
            padding: 32px;
            border-radius: 24px;
            width: 90%;
            max-width: 680px;
            max-height: 85vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: komari-slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .komari-stats-header {
            text-align: center;
            margin-bottom: 28px;
            padding-bottom: 24px;
            padding-right: 60px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.15);
            position: relative;
        }
        
        .komari-stats-header::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 2px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 1px;
        }
        
        .komari-stats-title {
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 12px 0;
            background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: none;
            font-family: 'Inter', sans-serif;
        }
        
        .komari-stats-subtitle {
            font-size: 16px;
            opacity: 0.8;
            margin: 0;
            color: #cbd5e1;
            font-weight: 400;
        }
        
        .komari-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .komari-stats-card {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            text-align: left;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .komari-stats-card h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .komari-stats-card .value {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .komari-stats-card .label {
            font-size: 14px;
            opacity: 0.8;
        }
        
        .komari-loading {
            text-align: center;
            padding: 48px;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.8);
            font-family: 'Inter', sans-serif;
            font-weight: 400;
        }
        
        .komari-loading::after {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-left: 10px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #6366f1;
            animation: komari-spin 1s ease-in-out infinite;
        }
        
        @keyframes komari-spin {
            to { transform: rotate(360deg); }
        }
        
        .komari-error {
            text-align: center;
            padding: 24px;
            color: #fecaca;
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%);
            border-radius: 16px;
            border: 1px solid rgba(239, 68, 68, 0.3);
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            backdrop-filter: blur(10px);
        }
        
        .komari-shared-probes {
            margin-top: 28px;
            padding-top: 24px;
            border-top: 0;
            position: relative;
        }
        

        
        .komari-shared-probes h3 {
            margin: 0 0 20px 0;
            font-size: 22px;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
            color: #f1f5f9;
        }
        
        .komari-probe-item {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid rgba(255, 255, 255, 0.15);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .komari-probe-item:hover {
            background: rgba(255, 255, 255, 0.12);
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        
        .komari-probe-info {
            flex: 1;
        }
        
        .komari-probe-username {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 6px;
            color: #f8fafc;
            font-family: 'Inter', sans-serif;
        }
        
        .komari-probe-url {
            font-size: 14px;
            opacity: 0.7;
            color: #cbd5e1;
            font-family: 'Inter', sans-serif;
        }
        
        .komari-probe-btn-small {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }
        
        .komari-probe-btn-small:hover {
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
        }
        
        .komari-summary-card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .komari-summary-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        }
        
        .komari-summary-card:hover {
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 0.12);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .komari-summary-title {
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 12px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Inter', sans-serif;
        }
        
        .komari-summary-subtitle {
            font-size: 15px;
            margin: 0 0 12px 0;
            opacity: 0.85;
            font-weight: 400;
            color: #e2e8f0;
        }
    `);

    class KomariMonitor {
        constructor() {
            this.probeUrl = GM_getValue('komari_probe_url', '');
            this.apiKey = GM_getValue('komari_api_key', '');
            this.shareEnabled = GM_getValue('komari_share_enabled', true);
            this.apiServer = PUBLIC_API_SERVER;
            this.targetUsername = GM_getValue('komari_target_username', '');
            this.showDomain = GM_getValue('komari_show_domain', true);
            this.init();
        }

        init() {
            this.createConfigButton();
            this.addProbeButtons();
            // 监听页面变化，动态添加按钮
            this.observePageChanges();
            // 加载共享探针数据
            this.loadSharedProbes();
        }

        createConfigButton() {
            const configBtn = document.createElement('button');
            configBtn.className = 'komari-config-btn';
            configBtn.innerHTML = '⚙️';
            configBtn.title = 'Komari探针配置';
            
            configBtn.addEventListener('click', () => {
                this.showConfigModal();
            });
            
            document.body.appendChild(configBtn);
        }

        observePageChanges() {
            const observer = new MutationObserver(() => {
                this.addProbeButtons();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        addProbeButtons() {
            // 更精确地查找用户名链接 - 排除头像链接，只匹配用户名文本链接
            const userLinks = document.querySelectorAll('a[href*="/u/"][data-user-card]:not(.main-avatar), a[href*="/user/"][data-user-card]:not(.main-avatar)');
            
            userLinks.forEach(link => {
                // 额外检查：排除包含img标签的链接（头像链接）
                if (link.querySelector('img')) {
                    return;
                }
                
                // 检查是否已经添加过按钮 - 检查父元素中是否已有探针按钮
                const parentElement = link.parentElement;
                if (parentElement && parentElement.querySelector('.komari-probe-btn')) {
                    return;
                }
                
                // 也检查紧邻的兄弟元素
                if (link.nextElementSibling && link.nextElementSibling.classList.contains('komari-probe-btn')) {
                    return;
                }
                
                // 给链接添加标记，避免重复处理
                if (link.hasAttribute('data-komari-processed')) {
                    return;
                }
                
                const username = this.extractUsername(link);
                if (username && (username === this.targetUsername || this.isSharedProbe(username))) {
                    this.addProbeButton(link, username);
                    link.setAttribute('data-komari-processed', 'true');
                }
            });
        }

        extractUsername(link) {
            const href = link.getAttribute('href');
            const match = href.match(/\/u(?:ser)?\/([^\/\?]+)/);
            return match ? match[1] : null;
        }

        isSharedProbe(username) {
            const sharedProbes = GM_getValue('komari_shared_probes', []);
            return sharedProbes.some(probe => probe.username === username);
        }

        addProbeButton(userLink, username) {
            const probeBtn = document.createElement('button');
            probeBtn.className = 'komari-probe-btn';
            probeBtn.textContent = '📊 探针';
            probeBtn.title = `查看 ${username} 的探针统计`;
            
            probeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showProbeStats(username);
            });
            
            userLink.parentNode.insertBefore(probeBtn, userLink.nextSibling);
        }

        async showProbeStats(username) {
            let probeUrl, apiKey;
            
            if (username === this.targetUsername) {
                probeUrl = this.probeUrl;
                apiKey = this.apiKey;
            } else {
                const sharedProbe = this.getSharedProbe(username);
                if (!sharedProbe) {
                    alert('未找到该用户的探针信息');
                    return;
                }
                probeUrl = sharedProbe.probeUrl;
                apiKey = ''; // 共享探针通常不需要API Key
            }
            
            if (!probeUrl) {
                alert('探针地址未配置');
                return;
            }
            
            const modal = document.createElement('div');
            modal.className = 'komari-stats-modal';
            modal.innerHTML = `
                <div class="komari-stats-content">
                    <div class="komari-stats-header">
                        <h2 class="komari-stats-title">${username} 的探针统计</h2>
                        ${this.shouldShowDomainForUser(username) ? `<p class="komari-stats-subtitle">${probeUrl}</p>` : ''}
                        <button class="komari-close-btn">×</button>
                    </div>
                    
                    <div id="komari-stats-container">
                        <div class="komari-loading">正在加载统计数据...</div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // 绑定关闭事件
            modal.querySelector('.komari-close-btn').addEventListener('click', () => {
                modal.remove();
            });
            
            this.loadStats(probeUrl, apiKey);
        }

        getSharedProbe(username) {
            const sharedProbes = GM_getValue('komari_shared_probes', []);
            return sharedProbes.find(probe => probe.username === username);
        }

        shouldShowDomainForUser(username) {
            if (username === this.targetUsername) {
                // 如果是自己的探针，使用自己的showDomain设置
                return this.showDomain;
            } else {
                // 如果是其他用户的探针，检查他们的showDomain设置
                const sharedProbe = this.getSharedProbe(username);
                return sharedProbe ? (sharedProbe.showDomain !== false) : true;
            }
        }

        async loadStats(probeUrl = this.probeUrl, apiKey = this.apiKey) {
            const container = document.getElementById('komari-stats-container');
            if (!container) return;
            
            try {
                // 获取节点信息
                const nodesData = await this.makeRPCCall(probeUrl, 'common:getNodes', {}, apiKey);
                const statusData = await this.makeRPCCall(probeUrl, 'common:getNodesLatestStatus', {}, apiKey);
                
                if (!nodesData || !statusData) {
                    throw new Error('无法获取探针数据');
                }
                
                this.renderStats(nodesData, statusData, container);
                
            } catch (error) {
                console.error('加载统计数据失败:', error);
                container.innerHTML = `<div class="komari-error">加载失败: ${error.message}</div>`;
            }
        }

        async makeRPCCall(baseUrl, method, params = {}, apiKey = '') {
            return new Promise((resolve, reject) => {
                const rpcUrl = `${baseUrl.replace(/\/$/, '')}/api/rpc2`;
                const payload = {
                    jsonrpc: '2.0',
                    method: method,
                    params: params,
                    id: Date.now()
                };
                
                const headers = {
                    'Content-Type': 'application/json'
                };
                
                if (apiKey) {
                    headers['Authorization'] = `Bearer ${apiKey}`;
                }
                
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: rpcUrl,
                    headers: headers,
                    data: JSON.stringify(payload),
                    timeout: 10000,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.error) {
                                reject(new Error(data.error.message || '请求失败'));
                            } else {
                                resolve(data.result);
                            }
                        } catch (e) {
                            reject(new Error('响应解析失败'));
                        }
                    },
                    onerror: function() {
                        reject(new Error('网络请求失败'));
                    },
                    ontimeout: function() {
                        reject(new Error('请求超时'));
                    }
                });
            });
        }

        renderStats(nodesData, statusData, container) {
            const nodes = Object.values(nodesData);
            const statuses = Object.values(statusData);
            
            // 计算统计数据
            const stats = this.calculateStats(nodes, statuses);
            
            container.innerHTML = `
                <div class="komari-summary-card" style="text-align: left;">
                    <div class="komari-summary-title">📊 节点状态</div>
                    <div class="komari-summary-subtitle">在线状态：${stats.onlineNodes}/${stats.totalNodes} 节点在线 (${stats.onlinePercentage}%)</div>
                </div>

                <div class="komari-summary-card" style="background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%); color: white; text-align: left; border-left: 4px solid #1976d2;">
                    <div class="komari-summary-title" style="color: #e3f2fd; text-align: left;">🖥️ 系统状态</div>
                    <div class="komari-summary-subtitle" style="color: #e3f2fd; text-align: left;">CPU核心总数：${stats.totalCores} 核</div>
                    <div style="color: white; font-size: 14px; opacity: 0.95; text-align: left;">
                        • 平均CPU使用率：${stats.avgCpu}%<br>
                        • 系统负载：${stats.avgLoad1} / ${stats.avgLoad5} / ${stats.avgLoad15} (1分钟/5分钟/15分钟平均负载)
                    </div>
                </div>

                <div class="komari-summary-card" style="background: linear-gradient(135deg, #ff6f00 0%, #e65100 100%); color: white; text-align: left; border-left: 4px solid #ff9800;">
                    <div class="komari-summary-title" style="color: #fff3e0; text-align: left;">💾 资源使用</div>
                    <div class="komari-summary-subtitle" style="color: #fff3e0; text-align: left;">系统资源占用情况</div>
                    <div style="color: white; font-size: 14px; opacity: 0.95; text-align: left;">
                        • 内存使用：${stats.memoryUsed} / ${stats.memoryTotal} (${stats.memoryPercentage}%)<br>
                        • 交换分区：${stats.swapUsed} / ${stats.swapTotal} (${stats.swapPercentage}%)<br>
                        • 硬盘使用：${stats.diskUsed} / ${stats.diskTotal} (${stats.diskPercentage}%)
                    </div>
                </div>

                <div class="komari-summary-card" style="background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); color: white; text-align: left; border-left: 4px solid #4caf50;">
                    <div class="komari-summary-title" style="color: #e8f5e8; text-align: left;">🌐 网络统计</div>
                    <div class="komari-summary-subtitle" style="color: #e8f5e8; text-align: left;">流量与连接统计</div>
                    <div style="color: white; font-size: 14px; opacity: 0.95; text-align: left;">
                        • 总下载流量：${stats.totalDownload}<br>
                        • 总上传流量：${stats.totalUpload}<br>
                        • 实时下载速度：${stats.currentDownSpeed}<br>
                        • 实时上传速度：${stats.currentUpSpeed}<br>
                        • 连接数：${stats.tcpConnections} TCP / ${stats.udpConnections} UDP
                    </div>
                </div>
            `;
        }

        calculateStats(nodes, statuses) {
            const totalNodes = nodes.length;
            const onlineStatuses = statuses.filter(s => s.online);
            const onlineNodes = onlineStatuses.length;
            const onlinePercentage = totalNodes > 0 ? ((onlineNodes / totalNodes) * 100).toFixed(1) : '0.0';
            
            // CPU统计
            const totalCores = nodes.reduce((sum, node) => sum + (node.cpu_cores || 0), 0);
            const avgCpu = onlineStatuses.length > 0 ? 
                (onlineStatuses.reduce((sum, status) => sum + (status.cpu || 0), 0) / onlineStatuses.length).toFixed(1) : '0.0';
            
            // 系统负载 - 使用正确的字段名
            const avgLoad1 = onlineStatuses.length > 0 ? 
                (onlineStatuses.reduce((sum, status) => sum + (status.load || 0), 0) / onlineStatuses.length).toFixed(2) : '0.00';
            const avgLoad5 = onlineStatuses.length > 0 ? 
                (onlineStatuses.reduce((sum, status) => sum + (status.load5 || 0), 0) / onlineStatuses.length).toFixed(2) : '0.00';
            const avgLoad15 = onlineStatuses.length > 0 ? 
                (onlineStatuses.reduce((sum, status) => sum + (status.load15 || 0), 0) / onlineStatuses.length).toFixed(2) : '0.00';
            
            // 内存统计
            const totalMemory = nodes.reduce((sum, node) => sum + (node.mem_total || 0), 0);
            const usedMemory = onlineStatuses.reduce((sum, status) => sum + (status.ram || 0), 0);
            const memoryPercentage = totalMemory > 0 ? ((usedMemory / totalMemory) * 100).toFixed(1) : '0.0';
            
            // 交换分区统计
            const totalSwap = nodes.reduce((sum, node) => sum + (node.swap_total || 0), 0);
            const usedSwap = onlineStatuses.reduce((sum, status) => sum + (status.swap || 0), 0);
            const swapPercentage = totalSwap > 0 ? ((usedSwap / totalSwap) * 100).toFixed(1) : '0.0';
            
            // 磁盘统计
            const totalDisk = nodes.reduce((sum, node) => sum + (node.disk_total || 0), 0);
            const usedDisk = onlineStatuses.reduce((sum, status) => sum + (status.disk || 0), 0);
            const diskPercentage = totalDisk > 0 ? ((usedDisk / totalDisk) * 100).toFixed(1) : '0.0';
            
            // 网络统计 - 使用正确的字段名
            const totalDownload = onlineStatuses.reduce((sum, status) => sum + (status.net_total_down || 0), 0);
            const totalUpload = onlineStatuses.reduce((sum, status) => sum + (status.net_total_up || 0), 0);
            const currentDownSpeed = onlineStatuses.reduce((sum, status) => sum + (status.net_in || 0), 0);
            const currentUpSpeed = onlineStatuses.reduce((sum, status) => sum + (status.net_out || 0), 0);
            
            // 连接数统计 - 使用正确的字段名
            const tcpConnections = onlineStatuses.reduce((sum, status) => sum + (status.connections || 0), 0);
            const udpConnections = onlineStatuses.reduce((sum, status) => sum + (status.connections_udp || 0), 0);
            
            return {
                totalNodes,
                onlineNodes,
                onlinePercentage,
                totalCores,
                avgCpu,
                avgLoad1,
                avgLoad5,
                avgLoad15,
                memoryUsed: this.formatBytes(usedMemory),
                memoryTotal: this.formatBytes(totalMemory),
                memoryPercentage,
                swapUsed: this.formatBytes(usedSwap),
                swapTotal: this.formatBytes(totalSwap),
                swapPercentage,
                diskUsed: this.formatBytes(usedDisk),
                diskTotal: this.formatBytes(totalDisk),
                diskPercentage,
                totalDownload: this.formatBytes(totalDownload),
                totalUpload: this.formatBytes(totalUpload),
                currentDownSpeed: this.formatBytes(currentDownSpeed) + '/s',
                currentUpSpeed: this.formatBytes(currentUpSpeed) + '/s',
                tcpConnections,
                udpConnections
            };
        }

        formatBytes(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        showConfigModal() {
            const modal = document.createElement('div');
            modal.className = 'komari-modal';
            
            const shareEnabled = this.shareEnabled;
            const apiServer = this.apiServer;
            
            modal.innerHTML = `
                <div class="komari-modal-content">
                    <div class="komari-modal-header">
                        <h2 class="komari-modal-title">Komari探针配置</h2>
                        <button class="komari-close-btn">×</button>
                    </div>
                    
                    <div class="komari-config-section">
                        <h3 style="margin: 0 0 15px 0; color: #333;">基础配置</h3>
                        <div class="komari-input-group">
                            <input type="text" class="komari-input" id="target-username" placeholder="论坛用户名" value="${this.targetUsername}">
                        </div>
                        <div class="komari-input-group">
                            <input type="text" class="komari-input" id="probe-url" placeholder="探针域名 (如: https://probe.example.com)" value="${this.probeUrl}">
                        </div>
                        <div class="komari-input-group">
                            <input type="text" class="komari-input" id="api-key" placeholder="探针API Key (可选)" value="${this.apiKey}">
                        </div>
                        <div class="komari-input-group">
                            <label style="display:flex;align-items:center;gap:8px;font-size:14px;color:#334155;">
                                <input type="checkbox" id="show-domain" ${this.showDomain ? 'checked' : ''}>
                                共享时显示域名（其他用户查看你的探针时是否显示域名）
                            </label>
                        </div>
                    </div>
                    

                    
                    <div style="text-align: center; margin-top: 25px;">
                        <button class="komari-btn" id="save-config">保存配置</button>
                        <button class="komari-btn komari-btn-secondary" id="test-connection">测试连接</button>
                        <button class="komari-btn komari-btn-secondary" id="refresh-shared">刷新共享</button>
                        <button class="komari-btn komari-btn-secondary" id="view-shared">查看共享</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // 绑定事件
            modal.querySelector('.komari-close-btn').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.querySelector('#save-config').addEventListener('click', () => {
                this.saveConfig();
                modal.remove();
            });
            
            modal.querySelector('#test-connection').addEventListener('click', () => {
                this.testConnection();
            });
            
            modal.querySelector('#refresh-shared').addEventListener('click', () => {
                this.refreshSharedProbes();
            });
            
            modal.querySelector('#view-shared').addEventListener('click', () => {
                this.showSharedProbes();
            });
        }

        saveConfig() {
            const targetUsername = document.getElementById('target-username').value.trim();
            const probeUrl = document.getElementById('probe-url').value.trim();
            const apiKey = document.getElementById('api-key').value.trim();
            const showDomain = document.getElementById('show-domain') ? document.getElementById('show-domain').checked : true;
            
            if (!targetUsername) {
                alert('请输入论坛用户名');
                return;
            }
            
            if (!probeUrl) {
                alert('请输入探针域名');
                return;
            }
            
            // 保存配置
            GM_setValue('komari_target_username', targetUsername);
            GM_setValue('komari_probe_url', probeUrl);
            GM_setValue('komari_api_key', apiKey);
            GM_setValue('komari_share_enabled', true);
            GM_setValue('komari_show_domain', showDomain);
            
            // 更新实例变量
            this.targetUsername = targetUsername;
            this.probeUrl = probeUrl;
            this.apiKey = apiKey;
            this.shareEnabled = true;
            this.apiServer = PUBLIC_API_SERVER;
            this.showDomain = showDomain;
            
            // 自动上传到共享数据库
            this.uploadToSharedDatabase();
            
            alert('配置已保存');
            
            // 重新添加按钮
            this.addProbeButtons();
        }

        async testConnection() {
            const probeUrl = document.getElementById('probe-url').value.trim();
            const apiKey = document.getElementById('api-key').value.trim();
            
            if (!probeUrl) {
                alert('请先输入探针域名');
                return;
            }
            
            try {
                const result = await this.makeRPCCall(probeUrl, 'rpc.ping', {}, apiKey);
                if (result === 'pong') {
                    alert('连接测试成功！');
                } else {
                    alert('连接测试失败：响应异常');
                }
            } catch (error) {
                alert(`连接测试失败：${error.message}`);
            }
        }

        // 共享功能相关方法
        async uploadToSharedDatabase() {
            if (!this.shareEnabled || !this.targetUsername || !this.probeUrl) {
                return;
            }
            
            try {
                const response = await this.makeAPICall('POST', '/api/shared-probes', {
                    username: this.targetUsername,
                    probeUrl: this.probeUrl,
                    showDomain: this.showDomain
                });
                
                console.log('探针信息已上传到共享数据库');
            } catch (error) {
                console.error('上传到共享数据库失败:', error);
            }
        }

        async getSharedData() {
            try {
                const response = await this.makeAPICall('GET', '/api/shared-probes');
                return response.data || [];
            } catch (error) {
                console.error('获取共享数据失败:', error);
                return [];
            }
        }

        async makeAPICall(method, endpoint, data = null) {
            return new Promise((resolve, reject) => {
                const url = `${this.apiServer}${endpoint}`;
                
                const options = {
                    method: method,
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000,
                    onload: function(response) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.success) {
                                resolve(result);
                            } else {
                                reject(new Error(result.message || '请求失败'));
                            }
                        } catch (e) {
                            reject(new Error('响应解析失败'));
                        }
                    },
                    onerror: function() {
                        reject(new Error('网络请求失败'));
                    },
                    ontimeout: function() {
                        reject(new Error('请求超时'));
                    }
                };
                
                if (data) {
                    options.data = JSON.stringify(data);
                }
                
                GM_xmlhttpRequest(options);
            });
        }

        async loadSharedProbes() {
            if (!this.shareEnabled) return;
            
            try {
                const sharedData = await this.getSharedData();
                GM_setValue('komari_shared_probes', sharedData);
                
                // 重新添加按钮
                setTimeout(() => {
                    this.addProbeButtons();
                }, 1000);
            } catch (error) {
                console.error('加载共享探针数据失败:', error);
            }
        }

        async refreshSharedProbes() {
            try {
                await this.loadSharedProbes();
                alert('共享探针列表已刷新！');
            } catch (error) {
                alert(`刷新失败: ${error.message}`);
            }
        }

        async showSharedProbes() {
            const modal = document.createElement('div');
            modal.className = 'komari-stats-modal';
            modal.innerHTML = `
                <div class="komari-stats-content">
                    <div class="komari-stats-header">
                        <h2 class="komari-stats-title">共享探针列表</h2>
                        <p class="komari-stats-subtitle">社区用户分享的探针信息</p>
                        <button class="komari-close-btn">×</button>
                    </div>
                    
                    <div id="komari-shared-container">
                        <div class="komari-loading">正在加载共享探针...</div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // 绑定关闭事件
            modal.querySelector('.komari-close-btn').addEventListener('click', () => {
                modal.remove();
            });
            
            this.renderSharedProbesList();
        }

        async renderSharedProbesList() {
            const container = document.getElementById('komari-shared-container');
            if (!container) return;
            
            try {
                const sharedData = await this.getSharedData();
                
                if (!sharedData || sharedData.length === 0) {
                    container.innerHTML = '<div class="komari-error">暂无共享探针数据</div>';
                    return;
                }
                
                const probesHtml = sharedData.map(probe => `
                    <div class="komari-probe-item" data-username="${probe.username}">
                        <div class="komari-probe-info">
                            <div class="komari-probe-username">${probe.username}</div>
                            ${probe.showDomain !== false ? `<div class="komari-probe-url">${probe.probeUrl}</div>` : ''}
                        </div>
                    </div>
                `).join('');
                
                container.innerHTML = `
                    <div class="komari-shared-probes">
                        <h3>共享探针 (${sharedData.length})</h3>
                        ${probesHtml}
                    </div>
                `;
                
                // 整行可点击打开统计
                container.querySelectorAll('.komari-probe-item').forEach(item => {
                    const uname = item.getAttribute('data-username');
                    item.style.cursor = 'pointer';
                    item.addEventListener('click', () => this.showProbeStats(uname));
                });
                
            } catch (error) {
                console.error('渲染共享探针列表失败:', error);
                container.innerHTML = `<div class="komari-error">加载失败: ${error.message}</div>`;
            }
        }
    }

    // 初始化
    window.komariMonitor = new KomariMonitor();
})();