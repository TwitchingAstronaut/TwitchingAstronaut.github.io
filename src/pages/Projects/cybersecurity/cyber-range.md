<style>
    html.dark {
        background-color: #0d0950;
        color: #fff;
        }

    .dark .nav-links a {
    color: #fff;
    }
    table {
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid black;
      padding: 4px;
      text-align: center;
    }
    td.hide{
      border: 0px solid black;
    }
    tr{
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      }
    tr:nth-child(even) {
        background-color: #f2f2f2;
        }
    th{
        background-color: #999999;
    }

    img {
      max-width: 100%;
      height: auto;
      
    }
    
</style>

<font size='+12'>Incident Response Project <br> Cyber Range</font>
<body>

## Table of Contents 

- [Table of Contents](#table-of-contents)
- [Purpose](#purpose)
- [Requirements](#requirements)
  - [Resources](#resources)
    - [Host System](#host-system)
    - [Virtual Machines](#virtual-machines)
  - [Network Map:](#network-map)
- [Setup](#setup)
  - [Network](#network)
    - [pfsense](#pfsense)
      - [pfSense Setup](#pfsense-setup)
      - [pfSense Config](#pfsense-config)
      - [Firewall Rules](#firewall-rules)
      - [DHCP Reservations](#dhcp-reservations)
  - [Blue Team (LAN)](#blue-team-lan)
    - [SEIM: Wazuh](#seim-wazuh)
    - [Linux Mint](#linux-mint)
    - [Debian 12 - Mail Server](#debian-12---mail-server)
  - [Red Team (ExtNet)](#red-team-extnet)
    - [Kali](#kali)
  - [Vulnerable Machines (DMZ)](#vulnerable-machines-dmz)
    - [Minotaur](#minotaur)
    - [SimpleCtf](#simplectf)
    - [EternalBlue](#eternalblue)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Virtual Machine Info](#virtual-machine-info)
- [Acknowledgements](#acknowledgements)


## Purpose

I'm currently studying a Certificate IV in Cybersecurity and for the Cluster course "Cyber Incident Response Threat Cluster" (VU23220 VU23221)
We have been tasked with creating an Incident Response Exercise(IRx).

This document will hopefully serve a how-to guide on how I setup the network for our IRx.

## Requirements
### Resources
#### Host System
* Host Computer: Asus TUF Gaming A15 (fa506iu)
    * CPU: Ryzen 7 4800h (8 Core, 16 Thread)
    * RAM: 64gb DDR4 3200mhz (Corsair Vengenace SODIMM)
    * HDD1: 512GB M.2 SSD
    * HDD2: 1TB Sata SSD
    * OS: Windows 10 Pro (22H2)
    * Virtualisation: Oracle Virtual Box

#### Virtual Machines

| VM Name | 💿 ISO | 🖥️ OVA | Role |
| --- | --- | --- | --- |
| pfSense | [💿 ISO](https://www.pfsense.org/download/) | | Tools|
| Debian 12 | [💿 ISO](https://www.debian.org/download) | [🖥️ OVA](https://www.linuxvmimages.com/images/debian-12/) | Tools|
| Wazuh 4.6.0| | [🖥️ OVA](https://documentation.wazuh.com/current/deployment-options/virtual-machine/virtual-machine.html) | Blue |
| Linux Mint |[💿 ISO](https://www.linuxmint.com/download.php) | [🖥️ OVA](https://www.osboxes.org/linux-mint/) | Blue |
| Vuln Hub Machines | |[🖥️ OVA](https://www.vulnhub.com) | DMZ |
| Kali 2024.1 | [💿 ISO](https://www.kali.org/get-kali/#kali-installer-images) | [🖥️ OVA](https://www.kali.org/get-kali/#kali-virtual-machines)| Red |

### Network Map:

<img src="/cyber-range.svg" width='50%'>

## Setup

The steps for setting up the above network should work on either VMware or VirtualBox, but as i am using VirtualBox in my setup, the instructions will only be for it.
(There maybe a follow-up guide for setting this up on Proxmox)

1. [Install Virualbox](https://www.virtualbox.org/manual/UserManual.html#installation)
2. Install [VirtualBox Extention pack](https://download.virtualbox.org/virtualbox/7.0.18/Oracle_VM_VirtualBox_Extension_Pack-7.0.18.vbox-extpack)
3. Download required ISO or OVA files

### Network

#### pfsense

##### pfSense Setup

Follow the [install guide](https://docs.netgate.com/pfsense/en/latest/install/index.html)

##### pfSense Config

We'll use 2 CPU Cores and 4GB (4096 MB) RAM and for this setup we will be using 4 Virtual Network Interfaces (vtnet) as detailed below:

| vtnet | Type | Driver | Subnet | Description |
| :---: | --- | --- | --- | --- |
| 1 | Bridged or NAT | Paravirtualised | dhcp | WAN interface
| 2 | Internal Network (intnet) | Paravirtualised | 192.168.10.1/24 | LAN Interface
| 3 | Internal Network (intnet-DMZ)| Paravirtualised | 192.168.56.1/24 | DMZ Interface
| 4 | Internal Network (intnet-EXT)| Paravirtualised | 172.16.0.1/24 | EXTNET Interface (fake WAN)

##### Firewall Rules

pfSense by Default has a *Default Deny* rule whereby all traffic is blocked unless explicitly allowed, the following rule allow traffic.
They are set as wide as possible but can be tightened if required (or want a challenge :P)

*Allow Rules*

|**Interface** | **Source** | **Destination** | **Protocol** | **Comment** |
| :---: | :---: | :---: | :---: | :---: |
| DMZ | DMZ | LAN | ALL |
| DMZ | DMZ | EXT | ALL |
| DMZ | DMZ | WAN | ALL | *Temp Rule*\*
| EXT | EXT | DMZ | ALL |
| EXT | EXT | WAN | ALL |
| LAN | LAN | WAN | ALL |
| LAN | LAN | WAN | ALL |

\* *After setup completed this rule is disabled or deleted*

##### DHCP Reservations

| VM | Network | IP |
| --- | --- | --- |
| Wazuh | LAN | 192.168.10.10 |
| Mail | LAN | 192.168.10.25 |
| Minotaur | DMZ | 192.168.56.223 |
| Simple | DMZ | 192.168.56.100 |
| Blue | DMZ | 192.168.56.65 |

### Blue Team (LAN)
#### SEIM: Wazuh

*There is currently a bug in the Wazuh 4.6.0 OVA that requires internet access during loading*
Follow the [install guide](https://documentation.wazuh.com/current/deployment-options/virtual-machine/virtual-machine.html)

We'll hold off on setting up the agents until later.

#### Linux Mint

We'll use this machine as the Config Machine & later during the IRx as the Blue team monitoring Box.

#### Debian 12 - Mail Server

### Red Team (ExtNet)
#### Kali

Follow the [install guide](https://www.kali.org/docs/virtualization/install-virtualbox-guest-vm/)

### Vulnerable Machines (DMZ)

For this particular IRx, we used 3 virtual machines
#### [Minotaur]()
- Import OVA file
- In Virtualbox machine settings set network card to "Internal Network - IntNetDMZ"
- set DHCP reservation in pfsense 192.168.56.223
- Restart VM
  - edit GRUB entry to login as root ``` insert code here ```
  - test network connectivity
  - install Wazuh Agent


#### [SimpleCtf]()
#### [EternalBlue]()

## Configuration

## Usage

### Virtual Machine Info

**Boot order**

    1. Pfsense
    2. Tinymail
    3. Wazuh
    4. Linux Mint
    5. Vulnerable Machines
    6. Kali
    
**Passwords**
|Machine | User | Pass |
| :---: | :---: | :---: |
| Pfsense | Admin |pfsense |
| TinyMail | John117 | John117 |
| Wazuh | admin | admin |
| Mint | Osboxes.org | Osboxes.org |
| Kali | kali | kali |

## Acknowledgements


</body>        
