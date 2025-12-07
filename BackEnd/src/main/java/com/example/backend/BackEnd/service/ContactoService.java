package com.example.backend.BackEnd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.BackEnd.model.Contacto;
import com.example.backend.BackEnd.repository.ContactoRepository;

@Service
public class ContactoService {
    @Autowired
    private ContactoRepository contactoRepository;

    public List<Contacto> getAllContactos() {
        return contactoRepository.findAll();
    }

    public Contacto saveContacto(Contacto contacto) {
        contacto.setIdContacto(null);
        return contactoRepository.save(contacto);
    }

    public Optional<Contacto> findByIdContacto(Long idContacto) {
        return contactoRepository.findById(idContacto);
    }

    public void deleteContacto(Long idContacto) {
        contactoRepository.deleteById(idContacto);
    }
    
}
